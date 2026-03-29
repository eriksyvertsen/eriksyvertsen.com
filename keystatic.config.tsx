import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "github" as const,
    repo: {
      owner: "eriksyvertsen",
      name: "eriksyvertsen.com",
    },
  },

  ui: {
    brand: { name: "eriksyvertsen.com" },
  },

  collections: {
    musings: collection({
      label: "Musings",
      slugField: "title",
      path: "content/musings/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Date" }),
        description: fields.text({ label: "Description", multiline: true }),
        readTime: fields.integer({ label: "Read time (min)" }),
        published: fields.checkbox({
          label: "Published",
          defaultValue: true,
        }),
        content: fields.mdx({ label: "Content" }),
      },
    }),
  },
});
