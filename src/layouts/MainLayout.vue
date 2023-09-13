<template>
  <q-layout view="hhh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-img
          @click="onSPFxLinkClick"
          src="../assets/icon-48x48.png"
          style="max-width: 48px; cursor: pointer"
          class="q-mx-xs"
        />
        <q-toolbar-title> SharePoint quicklinks </q-toolbar-title>

        <div>v{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated>
      <q-toolbar>
        <q-toolbar-title>
          Developed by
          <a
            href="javascript:;"
            class="no-underline text-secondary"
            @click="onSPFxLinkClick"
            >spfx-app.dev</a
          >
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { version } from '../../src-bex/manifest.json';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    return { version };
  },
  methods: {
    async onSPFxLinkClick() {
      await (this as any).$q.bex.send('redirectToExternal', {
        href: 'https://spfx-app.dev/',
      });
    },
  },
});
</script>
