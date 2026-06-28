import { HelpChat } from "@/components/help/HelpChat";

export default async function CustomerHelpChatPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const params = await searchParams;
  return <HelpChat topic={params.topic || "report"} />;
}
