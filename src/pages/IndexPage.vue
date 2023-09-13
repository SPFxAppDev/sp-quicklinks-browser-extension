<template>
  <q-page class="row items-center justify-evenly" style="min-width: 600px">
    <div class="row col-12" v-if="debugInfo">
      {{ debugInfo }}
    </div>
    <div class="row col-12" v-if="showContent">
      <link-list :linksections="links" :tab="userData.tab"></link-list>
    </div>

    <q-btn
      v-if="showContent"
      class="glossy edit-btn"
      round
      color="secondary"
      icon="edit"
      to="/options?showBacklink=true"
    >
      <q-tooltip class="bg-secondary">Configure URLs</q-tooltip>
    </q-btn>

    <div v-if="showErrorMessage" class="row col-12 q-pa-sm">
      <q-banner inline-actions class="text-white bg-red full-width">
        Sorry, an unexpected error has occurred. It could be that the current
        tab or extension settings/options could not be loaded!
      </q-banner>
    </div>

    <div v-if="showNotSPErrorMessage" class="row col-12 q-pa-sm">
      <q-banner inline-actions class="text-white bg-red full-width">
        The current website is not a sharepoint.com website. This extension will
        not work!
      </q-banner>
    </div>
  </q-page>
</template>

<script lang="ts">
import { LinkItemSection, LinkItem, LinkItemType } from 'components/models';
import { defaultLinks } from 'components/constants';
import { defineComponent, ref } from 'vue';
import { isNullOrEmpty, tpl } from '../utility/functions';
import LinkList from '../components/LinkList.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { LinkList },
  setup() {
    const links = ref<LinkItemSection[]>([]);
    const showErrorMessage = ref<boolean>(false);
    const showNotSPErrorMessage = ref<boolean>(false);
    const showContent = ref<boolean>(false);
    // const debugInfo = ref<string>('');

    return {
      links,
      userData: { tab: null, options: null },
      showErrorMessage,
      showNotSPErrorMessage,
      showContent,
      // debugInfo,
    };
  },
  created() {
    this.onInit();
  },
  methods: {
    async onInit() {
      const defaultOptions = {
        defaultSPLinks: JSON.stringify(defaultLinks[0].items),
        defaultPageLinks: JSON.stringify(defaultLinks[1].items),
        customLinks: JSON.stringify(defaultLinks[2].items),
        webUrlsHeading: defaultLinks[0].label,
        pageUrlsHeading: defaultLinks[1].label,
        customUrlsHeading: defaultLinks[2].label,
      };

      const info = await (this as any).$q.bex.send('onInit', {
        defaultValues: defaultOptions,
      });

      const { data } = info;

      this.userData = data;
      this.handleUI();
    },
    handleUI() {
      const data = this.userData;

      if (isNullOrEmpty(data) || isNullOrEmpty(data.tab)) {
        this.showErrorMessage = true;
        return;
      }

      const customLinks: LinkItemSection[] = [...data.options];

      if (isNullOrEmpty(customLinks)) {
        this.showErrorMessage = true;
        return;
      }

      let url = data.tab.url
        .toLowerCase()
        .split('?')[0]
        .split('&')[0]
        .split('#')[0];

      if (url.indexOf('.sharepoint.com') <= 0) {
        this.showNotSPErrorMessage = true;
        return;
      }

      let spWebAppUrl = url.split('/').slice(0, 3).join('/');
      let spWebUrl = url;
      let pageUrl = url;

      let isListOrLibrary = false;
      let isPage = false;
      let isPagesLib = false;
      let isApi = false;

      if (url.indexOf('/_api') >= 0) {
        spWebUrl = url.substring(0, url.indexOf('/_api'));
        isApi = true;
        url = spWebUrl;
      }

      if (url.indexOf('/sitepages/') > 0 || url.indexOf('/pages/') > 0) {
        isPagesLib = true;
        isListOrLibrary = true;
        spWebUrl =
          url.indexOf('/sitepages/') > 0
            ? url.substring(0, url.indexOf('/sitepages/'))
            : url.substring(0, url.indexOf('/pages/'));
        isPage =
          url.indexOf('/forms/') < 0 &&
          url.indexOf('.aspx') == url.length - '.aspx'.length;

        if (isPage) {
          pageUrl = url;
        }
      }

      if (url.indexOf('/forms/') > 0) {
        isListOrLibrary = true;

        let splittedUrl = url.substring(0, url.indexOf('/forms/')).split('/');
        splittedUrl.splice(-1);
        spWebUrl = splittedUrl.join('/');
      } else if (url.indexOf('/lists/') > 0) {
        isListOrLibrary = true;

        let splittedUrl = url.substring(0, url.indexOf('/lists/')).split('/');
        spWebUrl = splittedUrl.join('/');
      } else if (url.indexOf('/_layouts/') > 0) {
        spWebUrl = url.substring(0, url.indexOf('/_layouts/'));
      } else if (
        !isPage &&
        url.indexOf('.aspx') == url.length - '.aspx'.length
      ) {
        isPage = true;
        pageUrl = url;
        let splittedUrl = url.split('/');
        splittedUrl.splice(-1);
        spWebUrl = splittedUrl.join('/');
      } else if (!isPagesLib) {
        spWebUrl = url;
        isPage = isApi ? false : true;
        pageUrl = url;
      }

      const links: LinkItemSection[] = [];

      customLinks.forEach((linkSection: LinkItemSection) => {
        const sectionLabel: string = linkSection.label;
        const section: LinkItemSection = { label: sectionLabel, items: null };

        (linkSection.items as LinkItem[]).forEach((linkItem: LinkItem) => {
          if (!linkItem.enabled) {
            return;
          }

          if (!isPage && linkItem.type === LinkItemType.Page) {
            return;
          }

          if (
            !isPage &&
            linkItem.type === LinkItemType.Custom &&
            linkItem.url.indexOf('{pageurl}') >= 0
          ) {
            return;
          }

          if (section.items == null) {
            section.items = [];
          }

          linkItem.url = tpl(linkItem.url, {
            weburl: spWebUrl,
            webapp: spWebAppUrl,
            pageurl: pageUrl,
          });

          section.items.push(linkItem);
        });

        if (!isNullOrEmpty(section.items)) {
          links.push(section);
        }
      });

      // this.debugInfo = `
      // let spWebAppUrl = ${spWebAppUrl};
      // let spWebUrl = ${spWebUrl};
      // let pageUrl = ${pageUrl};
      // `;

      this.showContent = true;
      this.links = links;
    },
  },
});
</script>
