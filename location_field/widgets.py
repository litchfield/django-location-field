from django.forms import widgets
from django.utils.safestring import mark_safe

HTML = u"""
<button type="button" id="map_btn_%(name)s">Geocode</button>
<div style="margin:4px 0 0 0">
    <label></label>
    <div id="map_%(name)s" style="width: 500px; height: 250px"></div>
</div>
<script type="text/javascript">
location_field_load('%(name)s', '%(fields)s', %(zoom)d, '%(suffix)s')
</script>
"""

class LocationWidget(widgets.TextInput):
    def __init__(self, attrs=None, based_fields=None, zoom=None, suffix=None, **kwargs):
        self.based_fields = based_fields
        self.zoom = zoom
        self.suffix = suffix
        super(LocationWidget, self).__init__(attrs)

    def render(self, name, value, attrs=None):
        if not isinstance(value, (str, unicode)):
            if value is not None:
                value = '%s,%s' % (float(value[1]), float(value[0]))
            else:
                value = ''
        fields = ','.join(map(lambda f: '#id_%s' % f.name, self.based_fields));
        text_input = super(LocationWidget, self).render(name, value, attrs)
        zoom = self.zoom
        suffix = self.suffix
        return mark_safe(text_input + HTML % locals())

    class Media:
        js = (
            #'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',
            '//maps.google.com/maps/api/js?sensor=false',
            'location_field/form.js',
        )
