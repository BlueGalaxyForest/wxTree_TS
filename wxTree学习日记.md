# 现在有个问题:根目录的typings文件夹下面的index.d.ts的IAppOption接口为什么可以影响到app.ts的App()函数?

![image-20231115111239997](images.assets/image-20231115111239997.png)



# 多叉树的深度优先遍历与回溯(jv)

多叉树（N-ary tree）是一种树形数据结构，每个节点可以有多个子节点。深度优先遍历（Depth-First Search, DFS）是一种遍历树的方法，==它从根节点开始，沿着一条路径一直到达最深的节点，然后回溯到上一层，继续探索其他路径==。下面我会给你画图，并使用Java代码来演示多叉树的深度优先遍历。

```
       A
     / | \
    B  C  D
  /  |    \
 E    F     G
			 \
			  H
```

我们可以用以下的Java类来表示这个多叉树：

```java
import java.util.ArrayList;
import java.util.List;

class TreeNode {
    String val;
    List<TreeNode> children;

    public TreeNode(char val) {
        this.val = val;
        this.children = new ArrayList<>();
    }

    public void addChild(TreeNode child) {
        this.children.add(child);
    }
}

```

接下来，我们可以编写深度优先遍历的代码：

```js
public class NaryTreeDFS {

    public static void main(String[] args) {
        // 构建多叉树
        TreeNode root = new TreeNode("A");
        TreeNode b = new TreeNode("B");
        TreeNode c = new TreeNode("C");
        TreeNode d = new TreeNode("D");
        TreeNode e = new TreeNode("E"); //如果sout输出e.children,输出空数组[]
        TreeNode f = new TreeNode("F");
        TreeNode g = new TreeNode("G");

        root.addChild(b);
        root.addChild(c);
        root.addChild(d);
        b.addChild(e); 
        b.addChild(f);
        d.addChild(g);

        // 深度优先遍历
        System.out.println("深度优先遍历结果：");
        depthFirstSearch(root);
    }

    // 深度优先遍历
    public static void depthFirstSearch(TreeNode node) {
        if (node == null) {
            return;
        }

        // 打印当前节点的值
        System.out.print(node.val + " ");

        // 递归遍历子节点
        for (TreeNode child : node.children) { //如果遍历到底部,例如遍历到e,那么e.children=[], depthFirstSearch(child);不会被执行
            depthFirstSearch(child);
        }
    }
}

```

在这个例子中，我们首先构建了一个多叉树，然后使用深度优先遍历打印节点的值。在深度优先遍历中，我们首先访问根节点，然后递归地访问每个子节点。输出应该是：A B E F C D G。

## 问题引入

+ 假如我是搜索节点的需求改怎么办?当节点的value='C' or value='G';我可能需要给对应的父级加上openChildren=true的属性

  > 例如匹配到value='C',那么A节点需要加个openChildren=true;
  >
  > 例如匹配到value='G',那么D节点和A节点需要加个openChildren=true

* depthFirstSearch需要多传个值尝试=>但是java是值传递 

* 其次:可以说在深度优先遍历中，每个节点只会被访问一次，不会重复遍历多次。

  也就是说,我准备一个ancestors数组,从第一次遍历就add(当前node),当我遍历到E的时候,E没有children了,此时ancestors=["A","B],由于我要搜索的是"C"或"G"

  ,而E不满足,所以我尝试将ancestors=[],也就是清空.当我找到C的时候,就无法得到C的父亲A了.

* 也许可以采用双向指针,我找到G节点的时候,我只需要从G从下往上遍历到底就行.=> 需要在buildTree的时候,额外处理

* ==目前有种比较省时的方案是,每一次把father传给下一个节点,这样找到目标节点的时候,目标节点father指针指向了他的直线祖先也已经有了==

  ```java
      public static void main(String[] args) {
          // 构建多叉树
          TreeNode root = new TreeNode("A");
          TreeNode b = new TreeNode("B");
          TreeNode c = new TreeNode("C");
          TreeNode d = new TreeNode("D");
          TreeNode e = new TreeNode("E"); //如果sout输出e.children,输出空数组[]
          TreeNode f = new TreeNode("F");
          TreeNode g = new TreeNode("G");
          TreeNode h = new TreeNode("H");
  
          root.addChild(b);
          root.addChild(c);
          root.addChild(d);
          b.addChild(e);
          b.addChild(f);
          d.addChild(g);
          g.addChild(h);
  
          List<TreeNode> ancestors = new ArrayList<>();
          // 深度优先遍历
          System.out.println("深度优先遍历结果：" + ancestors);
          depthFirstSearch(root, null, "HF");
          System.out.println("root->" + root);
      }
  
      // 深度优先遍历
      public static void depthFirstSearch(TreeNode node, TreeNode father, String searchValue) {
          node.father = father;
          if (searchValue.contains(node.val)){
              System.out.println("find node->"+node);
          }
          for (TreeNode child:node.children){
              depthFirstSearch(child,node,searchValue);
          }
      }
  ```

  ```java
   
  find node->TreeNode{openChildren=false, val='F', father=TreeNode{openChildren=false, val='B', father=TreeNode{openChildren=false, val='A', father=null}}}
  
  find node->TreeNode{openChildren=false, val='H', father=TreeNode{openChildren=false, val='G', father=TreeNode{openChildren=false, val='D', father=TreeNode{openChildren=false, val='A', father=null}}}}
  
  ```

  

# 关于isClick点击印记的性能瓶颈问题

"每个节点的比较都涉及到了两个属性的比较，即 item[idStr] === node[idStr]。如果树结构很大，这样的比较操作可能会成为性能瓶颈。在这种情况下，你可能需要考虑是否可以优化数据结构，或者使用一些数据索引或哈希表来提高查找效率。"

```TS
class TreeNode {
  id: string;
  isClick: boolean;
  children: TreeNode[];

  constructor(id: string) {
    this.id = id;
    this.isClick = false;
    this.children = [];
  }
}

class Tree {
  root: TreeNode;
  idIndex: Record<string, TreeNode>;

  constructor() {
    this.root = new TreeNode('root');
    this.idIndex = {};
  }

  addNode(parentId: string, newNodeId: string) {
    const parentNode = this.idIndex[parentId] || this.root;
    const newNode = new TreeNode(newNodeId);
    parentNode.children.push(newNode);
    this.idIndex[newNodeId] = newNode;
  }

  clickNode(nodeId: string) {
    const node = this.idIndex[nodeId];
    if (node) {
      node.isClick = true;
    }
  }
}

// 示例用法
const tree = new Tree();

// 添加节点
tree.addNode('root', '1');
tree.addNode('root', '2');
tree.addNode('1', '1-1');
tree.addNode('1', '1-2');
tree.addNode('2', '2-1');
tree.addNode('2', '2-2');

// 点击节点
tree.clickNode('1-2');

```

```
root
|-- 1
|   |-- 1-1
|   |-- 1-2
|
|-- 2
    |-- 2-1
    |-- 2-2

```

