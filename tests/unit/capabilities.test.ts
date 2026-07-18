import {describe,expect,it} from "vitest";
import {routePublishAction} from "@/domain/capabilities";
describe("Skool capability routing",()=>{it("routes unsupported actions to export",()=>{expect(routePublishAction("create-classroom",["invite-member"])).toEqual({mode:"export",reason:"unsupported"})});it("permits only allowlisted connected actions",()=>{expect(routePublishAction("invite-member",["invite-member"])).toEqual({mode:"publish",action:"invite-member"});expect(routePublishAction("delete-community",["delete-community"])).toEqual({mode:"export",reason:"not-allowlisted"})})});
