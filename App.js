Ext.define('BLBoard', {
	extend: 'Rally.app.App',
	componentCls: 'app',
//	items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc2/doc/">App SDK 2.0rc2 Docs</a>'},
	launch: function() {
		var ppicker = Ext.create('Ext.Container', {
			items: [{
				xtype: 'rallymultiobjectpicker',
				modelType: 'project',
				emptyText: 'Pick Projects',
				storeConfig : {
				fetch: ['Name', 'ObjectID']
				},
				listCfg: {
					displayField: ['Name', 'ObjectID']
				},
				listeners: {
					collapse:function(p) {
						this.removeAll();
						var pcolumns = '[';
						var addNewConfig = null;
						var cardBoardConfig = null;
						_.each( p.getValue(), function (pn) {
							var pcolumn = "{ value: '/project/" + pn.get('ObjectID') + "', columnHeaderConfig: { headerTpl: '{project}', headerData: { project: '" + pn.get('Name') + "' } } }";
							pcolumns = pcolumns + pcolumn + ",";

//							console.log("name: " + pn.get("Name"));
//							console.log("OID: " + pn.get("ObjectID"));
						});
						pcolumns = pcolumns.substring(0, pcolumns.length - 1) + "]";
						console.log(p.getValue());
						addNewConfig = {
							xtype: 'rallyaddnew',
							recordTypes: ['User Story', 'Defect'],
							ignoredRequiredFields: ['Name', 'ScheduleState', 'Project'],
							listeners: {
								create: function(addNew, record) {
									Ext.Msg.alert('Add New', 'Added record named ' + record.get('Name'));
								}
							},
							showAddWithDetails: true
						};
		
						cardBoardConfig = {
							xtype: 'rallycardboard',
							types: ['User Story','Defect'],
							attribute: 'Project',
							columns: eval(pcolumns),
								cardConfig: {
									fields: ['Parent', 'Feature', 'Discussion', 'PlanEstimate'],
									editable: true,
									showIconMenus: true,
									showBlockedReason: true
								},
								storeConfig: {
								filters: [
									{ property: 'ScheduleState', operator: '<', value: 'In-Progress' },
									{ property: 'Iteration', operator: '=', value: '' }
								],
								sorters: [
									{ property: 'Rank', direction: 'ASC' }
								],
								//	Specify current project and scoping
								context: this.getContext().getDataContext()
							}
						};
						this.add(addNewConfig);
						this.add(cardBoardConfig);
					},
					scope: this
				}
			}]
		});
		this.add(ppicker);
	}
});
