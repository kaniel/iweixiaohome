angular.module('iwx')
  .controller('VoteTreeCtrl', function ($scope) {
    console.log($scope.activity);
  	//tree options
    $scope.treeOptions = {
      nodeChildren: 'children',
      dirSelectable: true,
      injectClasses: {
        ul: 'a1',
        li: 'tree_li',
        liSelected: 'a7',
        iExpanded: 'a3',
        iCollapsed: 'a4',
        iLeaf: 'a5',
        label: 'a6',
        labelSelected: 'a8'
      }
    };
    //tree data
    $scope.dataForTheTree =
    [
    { 'id' : 'vote', 'name' : '投票', 'children' : [
        { 'id' : 'vote1', 'name' : '投票1', 'children' : [] },
        { 'id' : 'vote2', 'name' : '投票2', 'children' : [] }
    ]}
   ];
  });