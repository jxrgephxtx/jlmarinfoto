module.exports = function(eleventyConfig) {
  // Pass through static files
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/images");

  // Computed data: auto-generate pageDescription and ogImage for projects
  eleventyConfig.addGlobalData("eleventyComputed", {
    pageDescription: (data) => {
      if (data.pageDescription) return data.pageDescription;
      if (data.title && data.tags && data.tags.includes && data.tags.includes("proyectos")) {
        return `Fotografía gastronómica profesional para ${data.title}. Proyecto realizado por Jorge López Marín, fotógrafo gastronómico en Madrid.`;
      }
      return data.site ? data.site.description : "";
    },
    ogImage: (data) => {
      if (data.ogImage) return data.ogImage;
      if (data.cover) {
        return `https://drive.google.com/thumbnail?id=${data.cover}&sz=w1200`;
      }
      return null;
    }
  });

  // Create a collection of projects sorted by order
  eleventyConfig.addCollection("proyectos", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/proyectos/*.md")
      .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
  });

  // Filter: build Google Drive thumbnail URL
  eleventyConfig.addFilter("driveThumb", function(id, size) {
    if (!id) return "";
    size = size || "w800";
    return `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;
  });

  // Filter: split into balanced columns for masonry
  eleventyConfig.addFilter("masonryCols", function(images, numCols) {
    if (!images || !Array.isArray(images)) return Array.from({length: numCols || 3}, () => []);
    numCols = numCols || 3;
    const cols = Array.from({length: numCols}, () => []);
    images.forEach((img, i) => {
      cols[i % numCols].push(img);
    });
    return cols;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
