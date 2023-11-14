/// <reference path="./cityTree.d.ts" />


const cityTree: City[] = [{
  cityId: 1,
  name: '湖南',
  children: [{
    cityId: 222,
    name: '长沙',
    children: [{
      cityId: 2221,
      name: '岳麓区',
      children: [{
        cityId: 22211,
        name: '柏家塘',
      },
      {
        cityId: 22212,
        name: '麓谷街道',
      }
      ]
    },
    {
      cityId: 334,
      name: '开福区',
    }
    ]
  },

  {
    cityId: 223,
    name: '衡阳',
    children: [{
      cityId: 2233,
      name: '蒸湘区',
    },
    {
      cityId: 2234,
      name: '雨母区',
    }
    ]
  },

  {
    cityId: 224,
    name: '永州',
    children: [{
      cityId: 2241,
      name: '道县',
      children: [{
        cityId: 22411,
        name: '梅花',
      },
      {
        cityId: 22412,
        name: '车头',
        children: [{
          cityId: 224121,
          name: '鲤鱼'
        }

        ]
      }
      ]
    }]
  },
  ]
},
{
  cityId: 8,
  name: '广东',
  children: [{
    cityId: 81,
    name: '深圳',
    children: [{
      cityId: 811,
      name: '福田',
      children: [{
        cityId: 8111,
        name: '上梅林',

      },
      {
        cityId: 8112,
        name: '莲花山',

      }
      ]
    },
    {
      cityId: 812,
      name: '龙华',
    },
    {
      cityId: 813,
      name: '南山',
    }
    ]
  },
  {
    cityId: 82,
    name: '广州'
  }
  ]
}
]

export default cityTree