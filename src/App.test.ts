import { beforeEach, describe, expect, test } from "vitest";
import { App } from "./App";
import { getByLabelText, getByText } from "@testing-library/dom";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { IDungeon } from "./editor/IDungeon";

describe(App.name, () => {
  let user: UserEvent = null!;
  beforeEach(() => {
    document.body.innerHTML = "";
    user = userEvent.setup();
    document.body.append(App());
  });

  test("play level 1", async () => {
    await user.click(getByText(document.body, "Play"));

    await user.click(getByText(document.body, "One: X is the Exit"));

    expect(document.location.hash).toBe("#/dungeon/One--X-is-the-Exit");

    await user.keyboard(
      "{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}"
    );

    getByText(document.body, "You escaped the dungeon!");
    getByText(document.body, "Try Again?");

    await user.click(getByText(document.querySelector(".backdrop")!, "Exit"));

    expect(document.location.hash).toBe("#/");
  });

  test("create level", async () => {
    await user.click(getByText(document.body, "Create"));

    const nameInput = getByLabelText(
      document.body,
      "Dungeon name:"
    ) as HTMLInputElement;

    expect(nameInput.value).toBe("");

    await user.click(nameInput);
    await user.keyboard("Auto test dungeon");

    expect(nameInput.value).toBe("Auto test dungeon");

    const selectTile = async (label: string) =>
      user.click(getByText(document.body, label));
    const gridEl = document.querySelector(".grid") as HTMLElement;
    const cell = (i: number) => gridEl?.children[i]! as HTMLElement;

    await selectTile("Start");

    await user.click(cell(0));

    expect(cell(0).style.backgroundColor).toBe("white");
    expect(cell(0).textContent).toBe("⭐️");

    await user.click(getByText(document.body, "Floor"));

    await user.click(gridEl?.children[1]!);

    await user.click(gridEl?.children[2]!);

    await user.click(getByText(document.body, "Exit"));

    await user.click(gridEl?.children[3]!);

    await user.click(getByText(document.body, "Save & Play"));

    const data = JSON.parse(localStorage.getItem("dungeons")!)[
      "Auto-test-dungeon"
    ] as IDungeon;
    expect(data.cells.slice(0, 4)).toEqual([3, 1, 1, 4]);

    expect(document.location.hash).toBe("#/dungeon/Auto-test-dungeon");

    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");

    getByText(document.body, "You escaped the dungeon!");
  });
});
