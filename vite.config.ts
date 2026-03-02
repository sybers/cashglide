import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (no prefix filter) so UMAMI_* are accessible at build time
  // without being bundled into the JS output
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      vue(),
      {
        name: "umami-analytics",
        transformIndexHtml(html) {
          const src = env.UMAMI_SCRIPT_SRC;
          const websiteId = env.UMAMI_WEBSITE_ID;

          if (!src || !websiteId) return html;

          const script = `    <script defer src="${src}" data-website-id="${websiteId}"></script>\n`;
          return html.replace("</head>", `${script}  </head>`);
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
