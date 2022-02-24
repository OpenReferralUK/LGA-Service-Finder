import { Contact, CostOption, Location, LocationWithSchedule, PhysicalAddress, Service } from './Types';

export const isEmptyContact = (c?: Contact) => {
    return (!c?.name && !c?.phones?.length);
};

export const isEmptyCostOption = (c?: CostOption) => {
    return (!c?.amount && !c?.amount_description && !c?.option);
};

export const canBeOnMap = (location?: Location) => {
    if (!location)
        return false;
    return (typeof location.latitude === 'number' && typeof location.longitude === 'number');
};

const EmptyArrayOfLocations: LocationWithSchedule[] = [];

export const getLocationWithSchedule = (service?: Service): LocationWithSchedule[] => {
    if (!service?.service_at_locations?.length)
        return EmptyArrayOfLocations;

    return service.service_at_locations
        .map((sl, i): LocationWithSchedule => ({
            ...sl.location,
            validLocation: !!sl.location,
            schedule: (sl.regular_schedule || EmptyArrayOfLocations)[i],
            service
        }))
        .filter(l => !!l.validLocation);
};

export const getLocationForMapForAllServices = (services?: Service[]): LocationWithSchedule[] => {
    if (!services?.length)
        return EmptyArrayOfLocations;

    const serviceLocations = services.map(s => getLocationWithSchedule(s).filter(l => canBeOnMap(l)));
    const locations: LocationWithSchedule[] = Array.prototype.concat.apply([], serviceLocations);
    return locations;
};

const cleanAddressLine = (text?: string): string => {
    if (!text)
        return '';
    return text.replace(/(,|\.)\s*$/, '')
        .replace(/^\s*(,|\.)\s*/, '')
        .trim();
};

const getAddressText = (address?: PhysicalAddress): string => {
    const lines = (!address ? [] : [
        address.address_1,
        address.address_2,
        address.address_3,
        address.postal_code,
        address.state_province,
        address.city,
        address.country
    ]);

    return lines.map(cleanAddressLine).filter(l => !!l).join(', ');
};

export const getAddressTextFromFirst = (addresses?: PhysicalAddress[]): string => {
    // this is a bit weird, one location can have multiple adresses (which makes no sense)
    return getAddressText(addresses?.[0]) || '';
};