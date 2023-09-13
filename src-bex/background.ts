import { bexBackground } from 'quasar/wrappers';

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.onClicked.addListener((/* tab */) => {
    // Opens our extension in a new browser window.
    // Only if a popup isn't defined in the manifest.
    chrome.tabs.create(
      {
        url: chrome.runtime.getURL('www/index.html'),
      },
      (/* newTab */) => {
        // Tab opened.
      }
    );
  });
});

declare module '@quasar/app-vite' {
  interface BexEventMap {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    log: [{ message: string; data?: any[] }, never];
    getTime: [never, number];

    'storage.get': [{ key: string | null }, any];
    'storage.set': [{ key: string; value: any }, any];
    'storage.remove': [{ key: string }, any];
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}

export default bexBackground((bridge /* , allActiveConnections */) => {
  // bridge.on('storage.get', ({ data, respond }) => {
  //   const { key } = data;
  //   if (key === null) {
  //     chrome.storage.local.get(null, (items) => {
  //       // Group the values up into an array to take advantage of the bridge's chunk splitting.
  //       respond(Object.values(items));
  //     });
  //   } else {
  //     chrome.storage.local.get([key], (items) => {
  //       respond(items[key]);
  //     });
  //   }
  // });
  // // Usage:
  // // const { data } = await bridge.send('storage.get', { key: 'someKey' })

  // bridge.on('storage.set', ({ data, respond }) => {
  //   chrome.storage.local.set({ [data.key]: data.value }, () => {
  //     respond();
  //   });
  // });
  // // Usage:
  // // await bridge.send('storage.set', { key: 'someKey', value: 'someValue' })

  // bridge.on('storage.remove', ({ data, respond }) => {
  //   chrome.storage.local.remove(data.key, () => {
  //     respond();
  //   });
  // });
  // // Usage:
  // // await bridge.send('storage.remove', { key: 'someKey' })

  bridge.on('onInit', ({ data, respond }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      if (typeof tabs === 'object' && tabs.length <= 0) {
        respond(null);
        return;
      }

      chrome.storage.sync.get(data.defaultValues, (options) => {
        let result: any[] = [];

        if (options) {
          result = [
            {
              label: options.webUrlsHeading,
              items: JSON.parse(options.defaultSPLinks),
            },
            {
              label: options.pageUrlsHeading,
              items: JSON.parse(options.defaultPageLinks),
            },
            {
              label: options.customUrlsHeading,
              items: JSON.parse(options.customLinks),
            },
          ];
        }

        respond({
          tab: tabs[0],
          options: result,
        });
      });
    });
  });
  // Usage:
  // await bridge.send('onInit', { defaultValues: {...} })

  bridge.on('onOptionsSaved', ({ data, respond }) => {
    chrome.storage.sync.set(data.options, () => {
      respond(true);
    });
  });
  // Usage:
  // await bridge.send('onOptionsSaved', { options: {...} })

  bridge.on('redirectToInternal', ({ data, respond }) => {
    chrome.tabs.update(data.tab.id, { url: data.href });
    respond();
  });

  bridge.on('redirectToExternal', ({ data, respond }) => {
    chrome.tabs.create({ url: data.href });
    respond();
  });
});
