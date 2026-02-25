export enum ProfileTabNames {
  MY_TABS = "myTabs",
  SAVED = "saved",
}

export const profileTabs: Record<ProfileTabNames, string> = {
  [ProfileTabNames.MY_TABS]: "Мои",
  [ProfileTabNames.SAVED]: "Сохраненные",
};
