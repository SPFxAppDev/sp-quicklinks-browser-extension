<template>
  <div class="full-width">
    <q-list
      bordered
      separator
      padding
      v-for="(linksection, sectionIndex) in sections"
      :key="'LinkSection_' + sectionIndex"
    >
      <q-item-label header class="text-weight-bold text-secondary">
        <q-input v-model="linksection.label" label="Headline" />
      </q-item-label>
      <q-separator />

      <q-item
        clickable
        v-ripple
        v-for="(link, linkIndex) in linksection.items"
        @click="onLinkClicked(link)"
        :key="'LinkItem_' + linkIndex"
      >
        <q-item-section>
          <q-item-label>
            <q-input
              v-model="link.url"
              filled
              label="URL"
              :disable="this.isUrlFieldDisabled(link)"
            />
          </q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-input v-model="link.label" filled label="Label" />
          </q-item-label>
        </q-item-section>

        <q-item-section class="disable-column">
          <q-item-label>
            <q-checkbox v-model="link.enabled">
              <q-tooltip>{{
                link.enabled ? 'Disable this link' : 'Enable this link'
              }}</q-tooltip>
            </q-checkbox>
          </q-item-label>
        </q-item-section>

        <q-item-section class="delete-column">
          <q-item-label v-if="this.isLinkDeletable(link)">
            <q-btn
              color="red"
              icon="delete"
              @click="this.onDeleteLinkItemClicked(linkIndex)"
            >
              <q-tooltip class="bg-red">Remove this link</q-tooltip>
            </q-btn>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item-section v-if="sectionIndex == 2">
        <q-item-label>
          <q-btn
            class="add-btn q-ma-xs"
            icon="add"
            color="primary"
            label="Add links"
            @click="onAddNewLinkClicked"
          />
        </q-item-label>
      </q-item-section>
    </q-list>
    <q-btn
      class="glossy edit-btn"
      round
      color="secondary"
      icon="save"
      @click="onSubmitClicked"
    >
      <q-tooltip class="bg-secondary">Save</q-tooltip>
    </q-btn>

    <div class="row col-12 q-pa-sm">
      <q-banner inline-actions class="text-white bg-blue full-width">
        You can use this placeholder in the url fields:
        <strong>{webapp}</strong>, <strong>{weburl}</strong>,
        <strong>{pageurl}</strong>
      </q-banner>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from 'vue';
import { LinkItemSection, LinkItem, LinkItemType } from './models';

export default defineComponent({
  name: 'EditLinkList',
  props: {
    linksections: {
      type: Object as PropType<LinkItemSection[]>,
      required: true,
    },
  },
  setup(props) {
    const sections = toRef(props, 'linksections');
    return { sections };
  },
  methods: {
    async onSubmitClicked() {
      const options = {
        defaultSPLinks: JSON.stringify(this.sections[0].items),
        defaultPageLinks: JSON.stringify(this.sections[1].items),
        customLinks: JSON.stringify(this.sections[2].items),
        webUrlsHeading: this.sections[0].label,
        pageUrlsHeading: this.sections[1].label,
        customUrlsHeading: this.sections[2].label,
      };

      const success = await (this as any).$q.bex.send('onOptionsSaved', {
        options: { ...options },
      });

      if (success) {
        this.$q.notify({
          message: 'Options saved',
          color: 'positive',
        });
      }
    },
    onAddNewLinkClicked() {
      this.sections[2].items.push({
        label: '',
        url: '',
        enabled: true,
        type: LinkItemType.Custom,
      });
    },
    onDeleteLinkItemClicked(linkIndex: number) {
      const allItems = [...this.sections];
      allItems[2].items.splice(linkIndex, 1);
      this.sections = allItems;
    },
    isUrlFieldDisabled(linkitem: LinkItem) {
      return linkitem.type != LinkItemType.Custom;
    },
    isLinkDeletable(linkitem: LinkItem) {
      return linkitem.type == LinkItemType.Custom;
    },
  },
});
</script>
