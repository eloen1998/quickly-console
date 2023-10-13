# Quickly Console [![GitHub stars](https://img.shields.io/github/stars/eloen1998/quickly-console.svg?style=?style=flat-square&logo=appveyor&?style=social&logo=appveyor&label=Star)](https://github.com/eloen1998/quickly-console) ![Installs](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/eloen.quickly-console?style=flat-square)

#### 一款vscode插件，帮助你快速地console.log出想要的变量。

##### 功能点
1. 直接插入打印语句模板
2. 选中变量，按照模板插入打印语句
3. **自动**识别当前行的*变量*，插入该变量的打印语句
4. 一键删除console
5. 插入格式配置

![使用示例](https://raw.githubusercontent.com/eloen1998/quickly-console/main/static/screenshots.gif)



##### 插入console使用方式
1. 命令 quicklyConsole.insertConsole
2. 快捷键 cmd+y（MAC，window可自行配置）


##### 删除console使用方式
1. 命令 quicklyConsole.deleteConsole
2. 快捷键 cmd+u（MAC，window可自行配置）


##### 适用场景
1. js/ts/vue文件中
2. js、ts语句中，且不能有影响ast的语法错误
3. 当前行或上一行有变量，或者选中了想要输出变量
