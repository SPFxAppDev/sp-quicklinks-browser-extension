<template>
  <q-page class="row items-center justify-evenly" style="min-width: 600px">
    <div class="row col-12" v-if="showGoBackBtn">
      <q-btn
        class="glossy q-ma-sm"
        color="primary"
        icon="arrow_back"
        label="Back"
        to="/popup"
      />
    </div>

    <div class="row col-12">
      <edit-link-list :linksections="links"></edit-link-list>
    </div>
  </q-page>
</template>

<script lang="ts">
import { LinkItemSection } from 'components/models';
import { defaultLinks } from 'components/constants';
import { defineComponent, ref } from 'vue';
import EditLinkList from '../components/EditLinkList.vue';

export default defineComponent({
  name: 'OptionsPage',
  components: { EditLinkList },
  setup() {
    const links = ref<LinkItemSection[]>([]);
    const showGoBackBtn = ref<boolean>(false);
    return { links, showGoBackBtn, userData: { tab: null, options: null } };
  },
  created() {
    console.log(
      'SSC ROUTE',
      this.$router.currentRoute,
      this.$router.currentRoute.value
    );
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
      const customLinks: LinkItemSection[] = [...data.options];

      if (
        this.$router.currentRoute.value &&
        this.$router.currentRoute.value.query &&
        this.$router.currentRoute.value.query.showBacklink
      ) {
        this.showGoBackBtn = true;
      }

      this.links = customLinks;
    },
  },
});
</script>
