import path from "path";
import assert from "yeoman-assert";
import helpers from "yeoman-test";

describe("generator-minimal-crud", () => {
  const dirName = new URL(".", import.meta.url).pathname;
  const testProjectRoot = path.join(dirName, "../test-project");

  before(async () => {
    await helpers.run(path.join(dirName, "../generators/app")).withPrompts({
      resourceName: "Product",
      resourcePath: "paths.product",
      resourceApiPath: "product",
      projectRoot: `${testProjectRoot}/src`,
      pagesDest: `${testProjectRoot}/src/app/product`,
    });
  });

  it("Creates files", () => {
    assert.file([
      `${testProjectRoot}/src/app/product/[id]/edit/page.tsx`,
      `${testProjectRoot}/src/app/product/page.tsx`,
      `${testProjectRoot}/src/app/product/[id]/page.tsx`,
      `${testProjectRoot}/src/app/product/new/page.tsx`,
      `${testProjectRoot}/src/sections/product/view/index.ts`,
      `${testProjectRoot}/src/sections/product/view/product-create-view.tsx`,
      `${testProjectRoot}/src/sections/product/view/product-details-view.tsx`,
      `${testProjectRoot}/src/sections/product/view/product-edit-view.tsx`,
      `${testProjectRoot}/src/sections/product/view/product-list-view.tsx`,
      `${testProjectRoot}/src/sections/product/product-details.tsx`,
      `${testProjectRoot}/src/sections/product/product-new-edit-form/index.tsx`,
      `${testProjectRoot}/src/sections/product/product-new-edit-form/sections/form-actions.tsx`,
      `${testProjectRoot}/src/sections/product/product-new-edit-form/sections/form-body.tsx`,
      `${testProjectRoot}/src/sections/product/product-new-edit-form/sections/index.ts`,
      `${testProjectRoot}/src/sections/product/product-table-filters-result.tsx`,
      `${testProjectRoot}/src/sections/product/product-table-row.tsx`,
      `${testProjectRoot}/src/sections/product/product-table-toolbar.tsx`,
      `${testProjectRoot}/src/services/productClient.ts`,
      `${testProjectRoot}/src/types/product.ts`,
      `${testProjectRoot}/src/schemas/product.ts`,
    ]);
  });
});
