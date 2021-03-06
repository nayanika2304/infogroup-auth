//Creates a Datatable with the information in data
function loadDatatable(establishments) {

	var wh = $(window).height();
	var calcDataTableHeight = (LessThan17inch) ? wh * 0.23 : wh * 0.30;

	var obj = {
		data: []
	};

	establishments = establishments.data.map(est => {
		obj.data.push({
			id: est.id,
			lat: (est.geopoint.coordinates[1] && est.geopoint.coordinates[0]) ? est.geopoint.coordinates[1] : null,
			lon: (est.geopoint.coordinates[1] && est.geopoint.coordinates[0]) ? est.geopoint.coordinates[0] : null,
			name: est.CONAME,
			employee: est.ALEMPSZ,
			industry: est.NAICSDS,
			prmsic: est.PRMSICDS
		});
	});

	$(document).ready(function () {
		var table = $('#jq_datatable').DataTable({
			dom: 'Bfrtip',
			"buttons": [{
				extend: '',
				text: 'Export',
				action: exportDataAsync
			}],
			"data": obj.data,
			"columns": [{
					title: "id",
					data: "id"
				},
				{
					title: "Name",
					data: "name",
					render: function (data, type, row, meta) {
						if (type === 'display') {
							data = '<a href="#" onclick="locatePointByCoordinate(' + row["lat"] + ', ' + row["lon"] + ')" data-zoom="12">' + data + '</a>';
						}
						return data;
					}
				},
				{
					title: "Emp",
					data: "employee"
				},
				{
					title: "Industry",
					data: "industry"
				},
				{
					title: "PR.SIC",
					data: "prmsic"
				},
				{
					title: "PRM",
					data: null,
					render: function (data, type, row, meta) {
						if (type === 'display') {
							data = "<div class='onoffswitch'><input type='checkbox' name='onoffswitch' onclick='updatePrimaryField("+row['id']+")' class='onoffswitch-checkbox' id='prmswitch"+row['id']+"' checked><label class='onoffswitch-label' for='prmswitch"+row['id']+"'><span class='onoffswitch-inner'></span><span class='onoffswitch-switch'></span></label></div>";
						}
						// function updatePrimaryField() located in public/infogroup.js
						return data;
					}
				},
				{
					title: "ED",
					data: null,
					defaultContent: "<button type='button' id='btn_edit' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#editModal'>Edit</button>"
				},
				{
					title: "lat",
					data: "lat"
				},
				{
					title: "lon",
					data: "lon"
				}
			],
			"columnDefs": [{
					"visible": false,
					"targets": 0 //Invisible, id column
				},
				{
					"width": 34,
					"targets": 2 //Empl column
				},
				{
					"width": 50,
					"targets": 5 //PRM column
				},
				{
					"width": 34,
					"targets": 6 //ED column
				},
				{
					"visible": false,
					"targets": 7 //Invisible Latitude column
				},
				{
					"visible": false,
					"targets": 8 //Invisible Longitude column
				}
			],
			"fixedColumns": true,
			"bLengthChange": false,
			"scrollY": calcDataTableHeight,
			"scrollCollapse": true,
			"pageResize": true,
			"destroy": true
		});

		$('#jq_datatable tbody').unbind("click").on('click', 'td button', function (){
			var data_row = table.row( $(this).parents('tr') ).data();
			// console.log(data_row);
			query_version = d3.select('#version-dropdown').property("value");
			loadEditModal(data_row['id'], query_version);
		});

	});
}

function clearDatatable() {
	$('#jq_datatable').DataTable().clear().draw();
}

function destroyDatatable() {
	$('#jq_datatable').DataTable().destroy();
}
// Marker creation when a business is selected
var mkr;

function locatePointByCoordinate(lat, lon) {
	if (lat != null && lon != null) {
		mymap.setView([lat, lon], 19);
		if (mkr) {
			mymap.removeLayer(mkr);
		}
		mkr = new L.marker([lat, lon], {}).addTo(mymap);
		mkr.on("click", function () {
			mymap.removeLayer(mkr);
		});
		markerList.push(mkr);
	}
}