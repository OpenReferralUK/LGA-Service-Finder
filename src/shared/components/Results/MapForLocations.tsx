import { FC, useEffect, useRef } from 'react';
import { LocationWithSchedule } from '../Types';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import Vector from 'ol/layer/Vector';
import { Feature, Overlay } from 'ol';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Geometry from 'ol/geom/Geometry';
import { getAddressTextFromFirst } from '../utilities';
import sanitizeHtml from 'sanitize-html';
import RenderFeature from 'ol/render/Feature';
import CircleStyle from 'ol/style/Circle';
import Text from 'ol/style/Text';

interface Props {
    id?: string;
    isHidden?: boolean;
    locations: LocationWithSchedule[];
    latestPageOfLocations?: LocationWithSchedule[];
    requestId?: any;
}

const wktProjectionOptions = {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
};

const styleCache: Record<number, any> = {};

export const MapForLocations: FC<Props> = ({ id = 'map-for-locations', locations, latestPageOfLocations, requestId, isHidden }) => {

    const mapRef = useRef<Map | null>(null);
    const overlayRef = useRef<Overlay | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const popupContentRef = useRef<HTMLDivElement>(null);
    const popupCloseRef = useRef<HTMLAnchorElement>(null);
    const vectorSourceRef = useRef<VectorSource<Geometry> | null>(null);
    const vectorLayerRef = useRef<Vector<ClusterSource> | null>(null);

    // const myStyle = new Style({
    //     image: new Circle({
    //         radius: 7,
    //         fill: new Fill({ color: 'red' }),
    //         stroke: new Stroke({
    //             color: [255, 0, 0], width: 2
    //         })
    //     })
    // });

    const closePopup = (e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e?.preventDefault();

        const overlay = overlayRef.current;
        if (!overlay)
            return;
        overlay.setPosition(undefined);
        popupCloseRef.current?.blur();
    };

    useEffect(() => { // must be before we init the map, otherwise we would clear anything we initially want on the map
        if (!vectorSourceRef.current)
            return;
        vectorSourceRef.current.clear();
    }, [requestId]);

    useEffect(() => {
        const vectorSource = new VectorSource({ wrapX: false });
        vectorSourceRef.current = vectorSource;

        const clusterSource = new ClusterSource({
            distance: 40,
            minDistance: 20,
            source: vectorSource,
        });

        const vectorLayer = new Vector({
            source: clusterSource,
            style: (feature: RenderFeature | Feature<Geometry>) => {
                const size = feature.get('features').length;

                if (!styleCache[size]) {
                    styleCache[size] = getStyle(size);
                }

                return styleCache[size];
            }
        });
        vectorLayerRef.current = vectorLayer;

        addLocationsToSource(locations, vectorSource);

        mapRef.current = new Map({
            target: id,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer
            ],
            view: new View({
                center: transform([-2.00, 53.5500], wktProjectionOptions.dataProjection, wktProjectionOptions.featureProjection),
                zoom: 6,
                maxZoom: 15,
                minZoom: 6
            })
        });

        var extent = vectorSourceRef.current.getExtent();
        if (extent.join(',') !== [Infinity,Infinity,-Infinity,-Infinity].join(',')) {
            mapRef.current?.getView().fit(extent);
            mapRef.current?.getView().setZoom((mapRef.current?.getView().getZoom() ?? 7) - 1);
        }
        const overlay = new Overlay({
            element: popupRef.current || new HTMLElement(),
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });
        overlayRef.current = overlay;

        mapRef.current.addOverlay(overlay);

        mapRef.current.on('singleclick', function (evt) {
            const map = mapRef.current;
            const vectorLayer = vectorLayerRef.current;
            const content = popupContentRef.current;

            if (!map || !vectorLayer || !content)
                return closePopup();

            const locations = getLocationsAtPoint(map, evt.pixel);

            if (!locations.length)
                return closePopup();

            const html = sanitizeHtml(getLocationsHtml(locations), { allowedAttributes: { '*': ['class', 'href'] } });

            if (!html)
                return closePopup();

            content.innerHTML = html;
            const coordinate = evt.coordinate;
            overlay.setPosition(coordinate);
        });
    }, []);

    useEffect(() => {
        if (!vectorSourceRef.current || !latestPageOfLocations)
            return;
        addLocationsToSource(latestPageOfLocations, vectorSourceRef.current);
    }, [latestPageOfLocations]);

    return <div id={id} className={`map mb-3 ${isHidden ? 'hidden' : ''}`}>
        <div id='popup' className='ol-popup' ref={popupRef}>
            <a href='#' id='popup-closer' className='ol-popup-closer' onClick={closePopup} ref={popupCloseRef}></a>
            <div id='popup-content' ref={popupContentRef}></div>
        </div>
    </div>;
};

const pointStroke = new Stroke({ color: '#92278f' });
const pointFill = new Fill({ color: '#ffffff' });
const pointStyle = new CircleStyle({
    radius: 15,
    stroke: pointStroke,
    fill: pointFill,
});
const textFill = new Fill({ color: '#92278f' });

const getStyle = (size: number) => {
    return new Style({
        image: pointStyle,
        text: new Text({
            text: size.toString(),
            fill: textFill,
        })
    });
}

const addLocationsToSource = (locations: LocationWithSchedule[], vectorSource: VectorSource<Geometry>) => {
    console.log('locations', locations)
    locations.forEach(location => {
        if (typeof location.longitude !== 'number' || typeof location.latitude !== 'number')
            return;

        const point = new Point(transform([location.longitude, location.latitude], wktProjectionOptions.dataProjection, wktProjectionOptions.featureProjection));
        const feature = new Feature({
            geometry: point,
            name: location.name,
            location

        });

        vectorSource.addFeature(feature);
    });
};

const getLocationsAtPoint = (map: Map, pixel: number[]): LocationWithSchedule[] => {
    const locations: LocationWithSchedule[] = [];

    map.forEachFeatureAtPixel(pixel, (feature) => {
        const features: Feature<Geometry>[] = feature.get('features') || [];

        features.forEach((feature) => {
            const location = feature.get('location') as LocationWithSchedule;
            if (!location)
                return;
            locations.push(location);
        });
    });

    locations.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    return locations;
};

const getLocationHtml = (location: LocationWithSchedule): string => {
    const locationHtml: string[] = ['<div class="popup-location">'];

    if (!!location.name) {
        locationHtml.push(`<h4>${location.name}</h4>`);
    }

    const address = getAddressTextFromFirst(location.physical_addresses);

    if (!!address) {
        locationHtml.push(`<p class='mb-0'>${address}</p>`);
    }

    if (!!location.schedule) {
        locationHtml.push(`<p class='mb-0'>${location.schedule.description}</p>`);
    }

    if (!!location.service) {
        locationHtml.push(`<a href="/results/serviceInfo?id=${location.service.id}">${location.service.name}</a>`);
    }

    locationHtml.push('</div>');

    return locationHtml.join('');
};

const getLocationsHtml = (locations: LocationWithSchedule[]): string => {
    const html: string[] = ['<div class="popup-locations">'];

    locations.forEach(l => html.push(getLocationHtml(l)));

    html.push('</div>');

    return html.join('');
};
