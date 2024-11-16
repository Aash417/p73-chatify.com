import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { mutation, QueryCtx } from './_generated/server';

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

export const create = mutation({
   args: {
      body: v.string(),
      workspaceId: v.id('workspaces'),
      image: v.optional(v.id('_storage')),
      channelId: v.optional(v.id('channels')),
      conversationId: v.optional(v.id('conversations')),
      parentMessagesId: v.optional(v.id('messages')),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error('unauthorized');

      const member = await getMember(ctx, args.workspaceId, userId);
      if (!member) throw new Error('unauthorized');

      let _conversationId = args.conversationId;

      // only possible senerio for replying in 1:1
      if (!args.conversationId && !args.channelId && args.parentMessagesId) {
         const parentMessage = await ctx.db.get(args.parentMessagesId);
         if (!parentMessage) throw new Error('Parent message not found');

         _conversationId = parentMessage.conversationsId;
      }

      const messageId = await ctx.db.insert('messages', {
         body: args.body,
         image: args.image,
         channelId: args.channelId,
         workspaceId: args.workspaceId,
         parentMessagesId: args.parentMessagesId,
         memberId: member._id,
         updatedAt: Date.now(),
         conversationsId: _conversationId,
      });

      return messageId;
   },
});
