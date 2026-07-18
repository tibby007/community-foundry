import {desiredCapabilities,routePublishAction} from "@/domain/capabilities";
export async function GET(){const connected=Boolean(process.env.SKOOL_MCP_URL&&process.env.SKOOL_MCP_TOKEN);const available=connected?["invite-member","unlock-course"]:[];return Response.json({connected,capabilities:desiredCapabilities.map(item=>({...item,...routePublishAction(item.action,available)}))})}
