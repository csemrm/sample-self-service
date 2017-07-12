/*globals lang*/
const extend = require('js-base/core/extend');
const ListViewItem = require('sf-core/ui/listviewitem');
const Router = require("sf-core/router");
const MockService = require('../../../objects/MockService');
const PageDesign = require("../../../ui/ui_pgCompanyDocuments");
const ItemDocument = require('../../../components/ItemDocument');
const DialogsLib = require("lib/ui/dialogs");
const Timer = require("sf-core/timer");

var loadingIndicator = DialogsLib.createLoadingDialog();

const Page_ = extend(PageDesign)(
	// Constructor
	function(_super){
		// Initalizes super class for this page scope
		_super(this);
		this.onShow = onShow.bind(this, this.onShow.bind(this));

		this.documents = [];
		initListView(this.listView, this.documents);
		initHeaderBar.call(this);
    }
);

var firstOnShow = true;
function onShow(parentOnShow) {
    parentOnShow();
    
    if (firstOnShow) {
        DialogsLib.startLoading(loadingIndicator, this.listViewContainer);
        Timer.setTimeout({
            task: function() {
                this.documents.slice(0);
                Array.prototype.push.apply(this.documents, MockService.getCompanyDocuments());
                this.listView.itemCount = this.documents.length;
                this.listView.refreshData();
                DialogsLib.endLoading(loadingIndicator, this.listViewContainer);
            }.bind(this),
            delay: 1000
        });
        firstOnShow = false;
    }
}

function initListView(listView, data) {
    listView.rowHeight = 75;
    listView.itemCount = data.length;
    listView.refreshEnabled = false;
    
    listView.onRowCreate = function() {
        var myListViewItem = new ListViewItem();
        var item = new ItemDocument();
        item.id = 200;
        myListViewItem.addChild(item);
        return myListViewItem;
    };
    
    listView.onRowBind = function(listViewItem, index) {
        var item = listViewItem.findChildById(200);
        item.data = data[index];
    };
    
    listView.onRowSelected = function() {
        Router.go("tabs/myCompany/documentDetail");
    }
}

function initHeaderBar() {
    this.layoutHeaderBar.headerBarTitle.text = lang["pgCompanyDocuments.pageTitle"];
}

module && (module.exports = Page_);