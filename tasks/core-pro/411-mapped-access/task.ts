type PagesMap = {
  homepage: string;
  about: string;
  contact: string;
};

type Page = keyof PagesMap

type PagesAccess = {
  [Prop in Page]: boolean
};


export function checkAccess(map: PagesMap): PagesAccess {
  const pageMapKeys = Object.keys(map) as Array<Page>

  const accessList = pageMapKeys.map<Partial<PagesAccess>>((item) => { return { [item]: true } })

  return accessList.reduce((result, element) => {
    return { ...result, ...element }
  }, {}) as PagesAccess

}
