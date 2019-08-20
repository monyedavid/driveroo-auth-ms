declare namespace HereMaps {
    interface gcpa {
        country?: string;
        housenumber?: string;
        city?: string;
        street?: string;
        fft?: string;
    }

    type gffa = string;

    type geocode_models = "pa" | "ffa";

    type mi_response_heremaps = { Timestamp: string };

    type co_ordinates = { Latitude: string; Longitude: string };

    type _mapView = { TopLeft: co_ordinates; BottomRight: co_ordinates };

    type _Locations_Address_data_addy = { value: string; key: string };

    type _Locations_Address_data = {
        Label: string;
        Country: string;
        State: string;
        County: string;
        City: string;
        Street: string;
        AdditionalData: [_Locations_Address_data_addy];
    };

    interface view_response_heremaps_result_Location {
        LocationId: string;
        LocationType: string;
        DisplayPosition: co_ordinates;
        NavigationPosition: [co_ordinates];
        MapView: _mapView;
        Address: _Locations_Address_data;
    }

    interface view_response_heremaps_result {
        Relevance: string;
        MatchLevel: string;
        MatchQuality: string;
        Location: view_response_heremaps_result_Location;
    }

    interface view_response_heremaps {
        _type: string;
        ViewId: string;
        Result: [view_response_heremaps_result];
    }

    interface Response_heremaps {
        MetaInfo: mi_response_heremaps;
        View: [view_response_heremaps];
    }

    interface _results {
        Response: Response_heremaps;
    }
}
