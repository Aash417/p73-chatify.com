import { getAuthUserId } from '@convex-dev/auth/server';
import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { mutation, query, QueryCtx } from './_generated/server';

async function getMember(
   ctx: QueryCtx,
   workspaceId: Id<'workspaces'>,
   userId: Id<'users'>,
) {
   return ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
         q.eq('workspaceId', workspaceId).eq('userId', userId),
      )
      .unique();
}

function populateUser(ctx: QueryCtx, userId: Id<'users'>) {
   return ctx.db.get(userId);
}

function populateMember(ctx: QueryCtx, memberId: Id<'members'>) {
   return ctx.db.get(memberId);
}

function populateReaction(ctx: QueryCtx, messageId: Id<'messages'>) {
   return ctx.db
      .query('reactions')
      .withIndex('by_message_id', (q) => q.eq('messageId', messageId))
      .collect();
}

async function populateThread(ctx: QueryCtx, messageId: Id<'messages'>) {
   const messages = await ctx.db
      .query('messages')
      .withIndex('by_parent_message_id', (q) =>
         q.eq('parentMessageId', messageId),
      )
      .collect();

   if (messages.length === 0)
      return {
         count: 0,
         image: undefined,
         timestamp: 0,
         name: '',
      };

   const lastMessage = messages[messages.length - 1];
   const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

   if (!lastMessageMember)
      return {
         count: 0,
         image: undefined,
         timestamp: 0,
         name: '',
      };

   const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

   return {
      count: messages.length,
      image: lastMessageUser?.image,
      timestamp: lastMessage._creationTime,
      name: lastMessageUser?.name,
   };
}

export const create = mutation({
   args: {
      body: v.string(),
      workspaceId: v.id('workspaces'),
      image: v.optional(v.id('_storage')),
      channelId: v.optional(v.id('channels')),
      conversationId: v.optional(v.id('conversations')),
      parentMessageId: v.optional(v.id('messages')),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error('unauthorized');

      const member = await getMember(ctx, args.workspaceId, userId);
      if (!member) throw new Error('unauthorized');

      let _conversationId = args.conversationId;

      // only possible senerio for replying in 1:1
      if (!args.conversationId && !args.channelId && args.parentMessageId) {
         const parentMessage = await ctx.db.get(args.parentMessageId);
         if (!parentMessage) throw new Error('Parent message not found');

         _conversationId = parentMessage.conversationsId;
      }

      const messageId = await ctx.db.insert('messages', {
         body: args.body,
         image: args.image,
         channelId: args.channelId,
         workspaceId: args.workspaceId,
         parentMessageId: args.parentMessageId,
         memberId: member._id,
         conversationsId: _conversationId,
      });

      return messageId;
   },
});

export const get = query({
   args: {
      channelId: v.optional(v.id('channels')),
      conversationId: v.optional(v.id('conversations')),
      parentMessageId: v.optional(v.id('messages')),
      paginationOpts: paginationOptsValidator,
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error('unauthorized');

      let _conversationId = args.conversationId;

      // only possible senerio for replying in 1:1
      if (!args.conversationId && !args.channelId && args.parentMessageId) {
         const parentMessage = await ctx.db.get(args.parentMessageId);
         if (!parentMessage) throw new Error('Parent message not found');

         _conversationId = parentMessage.conversationsId;
      }

      const results = await ctx.db
         .query('messages')
         .withIndex('by_channel_id_parent_message_id_conversation_id', (q) =>
            q
               .eq('channelId', args.channelId)
               .eq('parentMessageId', args.parentMessageId)
               .eq('conversationsId', _conversationId),
         )
         .order('desc')
         .paginate(args.paginationOpts);

      return {
         ...results,
         page: (
            await Promise.all(
               results.page.map(async (message) => {
                  const member = await populateMember(ctx, message.memberId);
                  const user = member
                     ? await populateUser(ctx, member.userId)
                     : null;

                  if (!member || !user) return null;

                  const reactions = await populateReaction(ctx, message._id);
                  const thread = await populateThread(ctx, message._id);
                  const image = message.image
                     ? await ctx.storage.getUrl(message.image)
                     : undefined;

                  const reactionsWithCounts = reactions.map((reaction) => {
                     return {
                        ...reaction,
                        count: reactions.filter(
                           (r) => r.value === reaction.value,
                        ).length,
                     };
                  });

                  const dedupedReactions = reactionsWithCounts.reduce(
                     (acc, reaction) => {
                        const existingReaction = acc.find(
                           (r) => r.value === reaction.value,
                        );

                        if (existingReaction)
                           existingReaction.memberIds = Array.from(
                              new Set([
                                 ...existingReaction.memberIds,
                                 reaction.memberId,
                              ]),
                           );
                        else
                           acc.push({
                              ...reaction,
                              memberIds: [reaction.memberId],
                           });

                        return acc;
                     },
                     [] as (Doc<'reactions'> & {
                        count: number;
                        memberIds: Id<'members'>[];
                     })[],
                  );

                  const reactionWithoutMemberIdProperty = dedupedReactions.map(
                     ({ memberId, ...rest }) => rest,
                  );

                  return {
                     ...message,
                     image,
                     member,
                     user,
                     reactions: reactionWithoutMemberIdProperty,
                     threadName: thread.name,
                     threadCount: thread.count,
                     threadImage: thread.image,
                     threadTimestamp: thread.timestamp,
                  };
               }),
            )
         ).filter((message) => message !== null),
      };
   },
});

export const update = mutation({
   args: {
      id: v.id('messages'),
      body: v.string(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error('unauthorized');

      const message = await ctx.db.get(args.id);
      if (!message) throw new Error('Message not found');

      const member = await getMember(ctx, message.workspaceId, userId);
      if (!member || member._id !== message.memberId)
         throw new Error('unauthorized');

      await ctx.db.patch(args.id, {
         body: args.body,
         updatedAt: Date.now(),
      });

      return args.id;
   },
});

export const remove = mutation({
   args: {
      id: v.id('messages'),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error('unauthorized');

      const message = await ctx.db.get(args.id);
      if (!message) throw new Error('Message not found');

      const member = await getMember(ctx, message.workspaceId, userId);
      if (!member || member._id !== message.memberId)
         throw new Error('unauthorized');

      await ctx.db.delete(args.id);

      return args.id;
   },
});

export const getById = query({
   args: { id: v.id('messages') },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) return null;

      const message = await ctx.db.get(args.id);
      if (!message) return null;

      const currentMember = await getMember(ctx, message.workspaceId, userId);
      if (!currentMember) return null;

      const member = await populateMember(ctx, message.memberId);
      if (!member) return null;

      const user = await populateUser(ctx, member.userId);
      if (!user) return null;

      const reactions = await populateReaction(ctx, message._id);
      const reactionsWithCounts = reactions.map((reaction) => {
         return {
            ...reaction,
            count: reactions.filter((r) => r.value === reaction.value).length,
         };
      });

      const dedupedReactions = reactionsWithCounts.reduce(
         (acc, reaction) => {
            const existingReaction = acc.find(
               (r) => r.value === reaction.value,
            );

            if (existingReaction)
               existingReaction.memberIds = Array.from(
                  new Set([...existingReaction.memberIds, reaction.memberId]),
               );
            else
               acc.push({
                  ...reaction,
                  memberIds: [reaction.memberId],
               });

            return acc;
         },
         [] as (Doc<'reactions'> & {
            count: number;
            memberIds: Id<'members'>[];
         })[],
      );

      const reactionWithoutMemberIdProperty = dedupedReactions.map(
         ({ memberId, ...rest }) => rest,
      );

      return {
         ...message,
         image: message.image
            ? await ctx.storage.getUrl(message.image)
            : undefined,
         user,
         member,
         reactions: reactionWithoutMemberIdProperty,
      };
   },
});
