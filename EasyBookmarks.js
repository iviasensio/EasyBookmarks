define( [
	'qlik',
	'text!./template.ng.html',
	'text!./dialog-template.ng.html',
	'text!./delete-template.ng.html',
	'ng!$q'
],
function ( qlik, template, dialogTemplate, deleteTemplate, $q) {
	'use strict';

	return {
		support: {
			export: false,
			exportData: false,
			snapshot: false
		},
		template: template,
		controller: ['$scope', 'luiDialog', function ( $scope, luiDialog ) {
			var app = qlik.currApp();			
			var myBasicRow = {
			    "qInfo": {
			        "qId": "0",
					"qType": "bookmark"
			    },
			    "qMeta": {
			        "title": "- Select a bookmark -",
			        "description": "- Select a bookmark -",
			        "published": true
			    },
			    "qData": {
			        "title": "- Select a bookmark -"					
			    }
			}
			$scope.selectedBookmark = "0";
			app.getList( 'BookmarkList', function ( items ) {
				$scope.bookmarks = items.qBookmarkList.qItems;													
				$scope.bookmarks.push(myBasicRow);				
			})
			
			$scope.alertValue = function(){  	

				var aplyBookmark = $('#repeatSelect').find('option:selected')[0].value;
			 	app.bookmark.apply(aplyBookmark);				 	

		    } 

		    $scope.defaultSelect = function (){
		    	$('#repeatSelect  option[value="0"]').prop("selected", true);
		    }

		    $scope.verifyOwner = function(){  
		    	
		    	var vPub = $('#repeatSelect').find('option:selected').attr("name");
		    	
		    	if(!vPub || vPub == 'false'){
			 		 $('#delId').prop('disabled', false);			 		 
			 	}else{
			 		$('#delId').prop('disabled', true);			 		
			 	}
		    } 		    
			
			$scope.openDialog = function() {				
				luiDialog.show({
					template: dialogTemplate,
					input: {
						name : $scope.name,
						description : $scope.description
					},
					controller: ['$scope', function( $scope ) {
						$scope.text = 'Plase, confirm you want to delete the bookmark';
						$scope.create = function(){  
							name = $('#name').val();
							app.bookmark.create(name,$('#description').val()); 							
				    	} 
					}]			
				});				
			};
			
			$scope.deleteDialog = function() {
				var aplyBookmark = $('#repeatSelect').find('option:selected')[0].value;				
				luiDialog.show({
					template: deleteTemplate,					
					controller: ['$scope', function( $scope ) {
						$scope.text = 'Plase, confirm you want to delete the bookmark';
						$scope.delete = function(){  
							app.bookmark.remove(aplyBookmark); 														
				    	} 
					}]
				});				
			};
		}]
	};
});
