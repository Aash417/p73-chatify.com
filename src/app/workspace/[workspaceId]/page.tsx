type Props = {
   params: { workspaceId: string };
};

export default function Page({ params: { workspaceId } }: Props) {
   return <div>workspace id : {workspaceId}</div>;
}
