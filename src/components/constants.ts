import { LinkItem, LinkItemSection, LinkItemType } from './models';

export const defaultSPLinks: LinkItem[] = [
  {
    label: 'Site settings',
    url: '{weburl}/_layouts/15/settings.aspx',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
  {
    label: 'Site contents',
    url: '{weburl}/_layouts/15/viewlsts.aspx',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
  {
    label: 'Website permissions',
    url: '{weburl}/_layouts/15/user.aspx',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
  {
    label: 'Users & groups',
    url: '{weburl}/_layouts/15/people.aspx',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
  {
    label: 'Site columns',
    url: '{weburl}/_layouts/15/mngfield.aspx',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
  {
    label: 'Site content types',
    url: '{weburl}/_layouts/15/mngctype.aspx',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
  {
    label: 'Recycle Bin',
    url: '{weburl}/_layouts/15/AdminRecycleBin.aspx?view=5',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
  {
    label: '2nd Stage recycle Bin',
    url: '{weburl}/_layouts/15/AdminRecycleBin.aspx?view=13#view=13',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
  {
    label: 'SPFx Workbench',
    url: '{weburl}/_layouts/15/workbench.aspx',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
  {
    label: 'Login with another user',
    url: '{weburl}/_layouts/15/closeConnection.aspx?loginasanotheruser=true',
    enabled: true,
    type: LinkItemType.WebAndSite,
  },
];

export const defaultPageLinks: LinkItem[] = [
  {
    label: 'Maintenance mode',
    url: '{pageurl}?maintenancemode=true',
    enabled: false,
    type: LinkItemType.Page,
  },
  {
    label: 'SPFx Debug',
    url: '{pageurl}?loadSPFX=true&debugManifestsFile=https%3A%2F%2Flocalhost%3A4321%2Ftemp%2Fmanifests.js',
    enabled: false,
    type: LinkItemType.Page,
  },
  {
    label: 'SPFx App Extension Debug',
    url: '{pageurl}?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions=%7B%22{appId}%22%3A%7B%22location%22%3A%22ClientSideExtension.ApplicationCustomizer%22%7D%7D',
    enabled: false,
    type: 2,
  },
];

export const defaultHeading = {
  webUrlsHeading: 'Website Urls',
  pageUrlsHeading: 'Page & Development Urls',
  customUrlsHeading: 'Custom Urls',
};

export const defaultLinks: LinkItemSection[] = [
  { label: defaultHeading.webUrlsHeading, items: [...defaultSPLinks] },
  { label: defaultHeading.pageUrlsHeading, items: [...defaultPageLinks] },
  { label: defaultHeading.customUrlsHeading, items: [] },
];
