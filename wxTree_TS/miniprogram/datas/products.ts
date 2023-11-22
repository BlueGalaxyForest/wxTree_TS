const productList: Product[] = [
  {
    id: 'wz',
    name: '旺仔牛奶',
    parentId: ''
  },
  {
    id: 'ksf',
    name: '康师傅',
    parentId: ''
  },
  {
    id: 'ksf1',
    name: '冰红茶',
    parentId: 'ksf'
  },
  {
    id: 'ksf2',
    name: '红烧牛肉面',
    parentId: 'ksf'
  },
  {
    id: 'wl',
    name: '卫龙',
    parentId: ''
  },
  {
    id: 'wl1',
    name: '清嘴骚',
    parentId: 'wl'
  },
  {
    id: 'wl2',
    name: '魔芋爽',
    parentId: 'wl'
  }
]

export default productList