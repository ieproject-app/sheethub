import data from './download-links.json';

export type DownloadLinkItem = {
  id: string;
  text: string;
  url: string;
};

export const AllDownloadLinks: DownloadLinkItem[] = data.downloadLinks;
