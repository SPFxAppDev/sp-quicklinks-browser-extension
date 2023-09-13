<template>
  <div class="full-width">
    <q-list
      bordered
      separator
      padding
      v-for="(linksection, sectionIndex) in linksections"
      :key="'LinkSection_' + sectionIndex"
    >
      <q-item-label header class="text-weight-bold text-secondary">
        {{ linksection.label }}
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
            {{ link.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="prompt" persistent @hide="onPromptHide" full-width>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ promptHeadline }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="promptValue"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat color="secondary" label="OK" v-close-popup />
          <q-btn flat label="Cancel" @click="onPrompedCancled" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { LinkItemSection, LinkItem, LinkItemType } from './models';

let currentClickedItem: LinkItem = null;

export default defineComponent({
  name: 'LinkList',
  props: {
    linksections: {
      type: Object as PropType<LinkItemSection>,
      required: true,
    },
    tab: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const prompt = ref<boolean>(false);
    const promptValue = ref<string>('');
    const promptHeadline = ref<string>('');
    const promptWasCanceled = ref<boolean>(false);

    return { prompt, promptValue, promptHeadline };
  },
  methods: {
    async onLinkClicked(linkItem: LinkItem) {
      currentClickedItem = linkItem;
      if (linkItem.type === LinkItemType.SPFxApp) {
        this.promptHeadline =
          'Please enter your app extenion ID from manifest.json';
        this.promptValue = '';
        this.promptWasCanceled = false;
        this.prompt = true;
        return;
      }

      this.openLink(linkItem.url);
    },
    onPrompedCancled() {
      this.promptWasCanceled = true;
      this.prompt = false;
    },
    onPromptHide() {
      if (this.promptWasCanceled) {
        return;
      }

      currentClickedItem.url = currentClickedItem.url.replace(
        '{appId}',
        this.promptValue
      );

      this.openLink(currentClickedItem.url);
    },
    async openLink(url: string) {
      await (this as any).$q.bex.send('redirectToInternal', {
        tab: this.tab,
        href: url,
      });

      window.close();
    },
  },
});
</script>
