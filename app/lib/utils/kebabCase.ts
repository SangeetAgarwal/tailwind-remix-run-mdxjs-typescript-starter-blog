import BananaSlug from "github-slugger";

const kebabCase = (str: any) => new BananaSlug().slug(str);

export default kebabCase;
