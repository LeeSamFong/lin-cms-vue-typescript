# 此项目是 [TaleLin/lin-cms-vue](https://github.com/TaleLin/lin-cms-vue) 的社区TypeScript版本

***

## 注意事项：

1.本项目没有完全按照原项目的代码实现该版本，尽量（只是尽量，并非完全）实现等同于原版本的功能。

2.使用本项目前，请先仔细阅读 [https://doc.cms.talelin.com/](https://doc.cms.talelin.com/) 的文档。

3.不能保证无缝升级。

***

## 与JS版本的lin-cms-vue不同的地方：

1.`v-permission`的使用方式：

此版本的使用方式示例为`v-permission:[type]="value"`，

实际使用方式为：`v-permission="你想给予的权限"`或`v-permission:hidden="你想给予的权限"`

`[type]`是可选的，是没有权限时要对DOM进行的处理，目前支持两个值：hidden（隐藏）、disabled（置灰）
