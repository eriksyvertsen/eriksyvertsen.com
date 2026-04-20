import { config, collection, singleton, fields } from "@keystatic/core";

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

  singletons: {
    siteConfig: singleton({
      label: "Site Config",
      path: "content/site-config",
      format: { data: "json" },
      schema: {
        musings: fields.checkbox({ label: "Musings", defaultValue: true }),
        mountains: fields.checkbox({ label: "Mountains", defaultValue: false }),
        about: fields.checkbox({ label: "About", defaultValue: true }),
        reading: fields.checkbox({ label: "Reading", defaultValue: false }),
        apps: fields.checkbox({ label: "Apps / Vibe Code", defaultValue: false }),
        kernels: fields.checkbox({ label: "Kernels", defaultValue: false }),
        librarian: fields.checkbox({ label: "Librarian", defaultValue: false }),
      },
    }),

    aboutPage: singleton({
      label: "About Page",
      path: "content/pages/about",
      format: { contentField: "body" },
      schema: {
        body: fields.mdx({ label: "Content" }),
      },
    }),
  },

  collections: {
    reading: collection({
      label: "Reading",
      slugField: "title",
      path: "content/reading/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        author: fields.text({ label: "Author" }),
        category: fields.text({
          label: "Category",
          description: 'e.g. "Currently Reading" or "Investing & Decision-Making"',
        }),
        notes: fields.text({ label: "Notes", multiline: true }),
        published: fields.checkbox({ label: "Published", defaultValue: true }),
        order: fields.integer({ label: "Display Order", defaultValue: 0 }),
      },
    }),

    apps: collection({
      label: "Apps",
      slugField: "title",
      path: "content/apps/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        url: fields.text({ label: "URL" }),
        tech: fields.array(fields.text({ label: "Technology" }), {
          label: "Tech Stack",
        }),
        description: fields.text({ label: "Description", multiline: true }),
        published: fields.checkbox({ label: "Published", defaultValue: true }),
        order: fields.integer({ label: "Display Order", defaultValue: 0 }),
      },
    }),

    kernels: collection({
      label: "Kernels",
      slugField: "title",
      path: "content/kernels/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Theme Name" } }),
        ideas: fields.array(
          fields.text({ label: "Idea" }),
          { label: "Ideas" }
        ),
        published: fields.checkbox({ label: "Published", defaultValue: true }),
        order: fields.integer({ label: "Display Order", defaultValue: 0 }),
      },
    }),

    mountains: collection({
      label: "Mountains",
      slugField: "title",
      path: "content/mountains/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        stravaActivityId: fields.text({
          label: "Strava Activity ID",
          description: "Find this in the activity URL: strava.com/activities/[ID]",
          validation: { length: { min: 1 } },
        }),
        published: fields.checkbox({ label: "Published", defaultValue: true }),
        order: fields.integer({
          label: "Display Order",
          description: "Lower numbers appear first (1, 2, 3…). New entries default to 999.",
          defaultValue: 999,
        }),
        supplementPhotos: fields.array(
          fields.image({
            label: "Photo",
            directory: "public/mountains",
            publicPath: "/mountains",
          }),
          { label: "Supplement Photos" }
        ),
        notes: fields.text({
          label: "Trip Notes",
          multiline: true,
          description: "Appears below photos. Markdown supported.",
        }),
      },
    }),

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
        published: fields.checkbox({ label: "Published", defaultValue: true }),
        content: fields.mdx({ label: "Content" }),
      },
    }),
  },
});
