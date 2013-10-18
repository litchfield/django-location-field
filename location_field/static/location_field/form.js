function location_field_load(map, location_based, zoom, suffix)
{
    var map_btn = django.jQuery('#map_btn_' + map);
    map = django.jQuery('#map_' + map);
    location_based = django.jQuery(location_based);

    var parent = map.parent().parent();

    var location_map;

    var location_coordinate = parent.find('input[type=text]');

    function savePosition(point)
    {
        if (!point) return;
        location_coordinate.val(point.lat().toFixed(6) + "," + point.lng().toFixed(6));
        location_map.panTo(point);
    }

    function load() {
        var point = new google.maps.LatLng(1, 1);

        var options = {
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        location_map = new google.maps.Map(map[0], options);

        var initial_position;

        if (location_coordinate.val())
        {
            var l = location_coordinate.val().split(/,/);

            if (l.length > 1)
            {
                initial_position = new google.maps.LatLng(l[0], l[1]);
            }
        }

        var marker = new google.maps.Marker({
            map: location_map,
            position: initial_position,
            draggable: true
        });

        google.maps.event.addListener(marker, 'dragend', function(mouseEvent) {
            savePosition(mouseEvent.latLng);
        });

        google.maps.event.addListener(location_map, 'click', function(mouseEvent){
            marker.setPosition(mouseEvent.latLng);
            savePosition(mouseEvent.latLng);
        });

        map_btn.click(function() {
            var lstr = [];
            location_based.each(function(a, b) {
                var j = django.jQuery(b)
                if (j.children('option').length > 0) {
                    lstr.push(j.children("option").filter(":selected").text());
                } else if (j.val() != '') {
                    lstr.push(j.val());
                }
            });
            if (lstr.length > 0 && suffix != '') 
                lstr.push(suffix);
            geocode(lstr.join(','), function(l){
                location_coordinate.val(l.lat()+','+l.lng());
            });
        });

        function placeMarker(location) {
            location_map.setZoom(zoom);
            marker.setPosition(location);
            location_map.setCenter(location);
            savePosition(location);
        }

        function geocode(address, cb) {
            var result;
            var geocoder = new google.maps.Geocoder();
            if (geocoder) {
                console.log(address);
                geocoder.geocode({"address": address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        cb(results[0].geometry.location);
                        placeMarker(results[0].geometry.location);
                    }
                });
            }
        }

        function geocode_reverse(location, cb) {
            var geocoder = new google.maps.Geocoder();
            if (geocoder) {
                geocoder.geocode({"latLng": location}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        cb(results[0].geometry.location);
                        placeMarker(results[0].geometry.location);
                    }
                });
            }
        }

        placeMarker(initial_position);
    }

    load();

};