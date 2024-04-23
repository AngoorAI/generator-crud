import Generator from "yeoman-generator";
import lodash from "lodash";
import pluralize from "pluralize";
import { mkdirp } from "mkdirp";

const { kebabCase, camelCase, snakeCase } = lodash;
const { plural } = pluralize;

export default class extends Generator {
  async prompting() {
    const getInWords = (text) => {
      const words = text.split(/(?=[A-Z])/);

      if (words.length > 0) {
        words[words.length - 1] = plural(words[words.length - 1]);
      }

      const pluralText = words.join(" ");
      return pluralText;
    };

    const validateRequired = (input, message) =>
      input === "" ? message : true;

    this.log("📝 Resource Information\n");

    const resourceInformation = await this.prompt([
      {
        type: "input",
        name: "resourceName",
        message: "Enter resource name:",
        default: "User",
        validate: (input) =>
          validateRequired(input, "Resource name is required"),
      },
      {
        type: "input",
        name: "resourcePath",
        message: "Enter resource path string:",
        default: (answers) => `paths.${snakeCase(answers.resourceName)}`,
        validate: (input) =>
          validateRequired(input, "Resource path string is required"),
      },
      {
        type: "input",
        name: "resourceApiPath",
        message:
          "Enter the base path for your resource API (excluding end '/'):",
        default: (answers) => `${kebabCase(answers.resourceName)}s`,
        validate: (input) =>
          validateRequired(
            input,
            "Please provide the base path for your resource API"
          ),
      },
    ]);

    this.log("\n🏗️ Project Structure\n");

    const projectStructure = await this.prompt([
      {
        type: "input",
        name: "projectRoot",
        message: "Enter project src directory path (excluding end '/'):",
        default: `${this.destinationRoot()}/src`,
        store: true,
        validate: (input) =>
          validateRequired(input, "Project root path is required"),
      },
      {
        type: "input",
        name: "pagesDest",
        message: "Enter destination to place pages (excluding end '/'):",
        default: (answers) =>
          `${answers.projectRoot}/app/${kebabCase(
            resourceInformation.resourceName
          )}`,
        validate: (input) =>
          validateRequired(input, "Page content folder is required"),
      },
    ]);

    const answers = { ...resourceInformation, ...projectStructure };
    const {
      resourceName,
      resourcePath,
      resourceApiPath,
      projectRoot,
      pagesDest,
    } = answers;

    Object.assign(this, {
      resourceName,
      resourcePath,
      resourceApiPath,
      projectRoot,
      pagesDest,
      sectionsDest: `${projectRoot}/sections/${kebabCase(resourceName)}`,
      servicesDest: `${projectRoot}/services`,
      typesDest: `${projectRoot}/types`,
      schemasDest: `${projectRoot}/schemas`,
      resourceNameSnakeCase: snakeCase(resourceName),
      resourceNameKebabCase: kebabCase(resourceName),
      resourceNameLowerCamelCase: camelCase(resourceName),
      resourceNamePlural: plural(resourceName),
      resourceNameInWords: getInWords(resourceName),
    });
  }

  writing() {
    this.destinationRoot(this.projectRoot);

    const makeDirectory = (path) => mkdirp(this.destinationPath(path));

    makeDirectory(this.pagesDest);
    makeDirectory(this.sectionsDest);
    makeDirectory(this.servicesDest);
    makeDirectory(this.typesDest);
    makeDirectory(this.schemasDest);

    const allTemplates = [
      {
        src: "pages/resource-edit-page.txt",
        dest: `${this.pagesDest}/[id]/edit/page.tsx`,
      },
      {
        src: "pages/resource-list-page.txt",
        dest: `${this.pagesDest}/page.tsx`,
      },
      {
        src: "pages/resource-read-page.txt",
        dest: `${this.pagesDest}/[id]/page.tsx`,
      },
      {
        src: "pages/resource-new-page.txt",
        dest: `${this.pagesDest}/new/page.tsx`,
      },
      {
        src: "sections/view/index.txt",
        dest: `${this.sectionsDest}/view/index.ts`,
      },
      {
        src: "sections/view/resource-create-view.txt",
        dest: `${this.sectionsDest}/view/${this.resourceNameKebabCase}-create-view.tsx`,
      },
      {
        src: "sections/view/resource-details-view.txt",
        dest: `${this.sectionsDest}/view/${this.resourceNameKebabCase}-details-view.tsx`,
      },
      {
        src: "sections/view/resource-edit-view.txt",
        dest: `${this.sectionsDest}/view/${this.resourceNameKebabCase}-edit-view.tsx`,
      },
      {
        src: "sections/view/resource-list-view.txt",
        dest: `${this.sectionsDest}/view/${this.resourceNameKebabCase}-list-view.tsx`,
      },
      {
        src: "sections/resource-details.txt",
        dest: `${this.sectionsDest}/${this.resourceNameKebabCase}-details.tsx`,
      },
      {
        src: "sections/resource-new-edit-form/index.txt",
        dest: `${this.sectionsDest}/${this.resourceNameKebabCase}-new-edit-form/index.tsx`,
      },
      {
        src: "sections/resource-new-edit-form/sections/form-actions.txt",
        dest: `${this.sectionsDest}/${this.resourceNameKebabCase}-new-edit-form/sections/form-actions.tsx`,
      },
      {
        src: "sections/resource-new-edit-form/sections/form-body.txt",
        dest: `${this.sectionsDest}/${this.resourceNameKebabCase}-new-edit-form/sections/form-body.tsx`,
      },
      {
        src: "sections/resource-new-edit-form/sections/index.txt",
        dest: `${this.sectionsDest}/${this.resourceNameKebabCase}-new-edit-form/sections/index.ts`,
      },
      {
        src: "sections/resource-table-filters-result.txt",
        dest: `${this.sectionsDest}/${this.resourceNameKebabCase}-table-filters-result.tsx`,
      },
      {
        src: "sections/resource-table-row.txt",
        dest: `${this.sectionsDest}/${this.resourceNameKebabCase}-table-row.tsx`,
      },
      {
        src: "sections/resource-table-toolbar.txt",
        dest: `${this.sectionsDest}/${this.resourceNameKebabCase}-table-toolbar.tsx`,
      },
      {
        src: "services/resourceClient.txt",
        dest: `${this.servicesDest}/${this.resourceNameLowerCamelCase}Client.ts`,
      },
      {
        src: "types/resource.txt",
        dest: `${this.typesDest}/${this.resourceNameKebabCase}.ts`,
      },
      {
        src: "schemas/resource.txt",
        dest: `${this.schemasDest}/${this.resourceNameKebabCase}.ts`,
      },
    ];

    allTemplates.forEach(({ src, dest }) => {
      this.fs.copyTpl(
        this.templatePath(src),
        this.destinationPath(dest),
        this.getTemplateData()
      );
    });
  }

  getTemplateData() {
    return {
      resourceName: this.resourceName,
      resourceNameSnakeCase: this.resourceNameSnakeCase,
      resourceNameKebabCase: this.resourceNameKebabCase,
      resourceNameLowerCamelCase: this.resourceNameLowerCamelCase,
      resourceNamePlural: this.resourceNamePlural,
      resourceNameInWords: this.resourceNameInWords,
      resourcePath: this.resourcePath,
      resourceApiPath: this.resourceApiPath,
    };
  }

  paths() {
    this.log(this.destinationPath());
  }
}
