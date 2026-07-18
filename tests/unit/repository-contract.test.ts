import {beforeEach,describe,expect,it} from "vitest";
import {createProjectFromTemplate} from "@/data/templates";
import {LocalProjectRepository} from "@/lib/repository/local-repository";
describe("project repository contract",()=>{beforeEach(()=>localStorage.clear());it("saves, retrieves, and lists valid projects",async()=>{const repository=new LocalProjectRepository();const project=createProjectFromTemplate("consulting-client-accelerator","Women over 40");await repository.save(project);expect(await repository.get(project.id)).toEqual(project);expect((await repository.list()).map(item=>item.id)).toContain(project.id)})});
