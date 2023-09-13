export enum LinkItemType {
  WebAndSite = 0,
  Page,
  SPFxApp,
  Custom,
}

export interface LinkItem {
  label: string;
  url: string;
  enabled: boolean;
  type: LinkItemType;
}

export interface LinkItemSection {
  label: string;
  items: LinkItem[];
}
