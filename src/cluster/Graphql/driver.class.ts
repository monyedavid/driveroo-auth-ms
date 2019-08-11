import * as rp from "request-promise";
import { Session } from "../../types/graphql-utile";

export class DriverMs {
    url: string;
    options: {
        jar: any;
        withCredentials: boolean;
        json: boolean;
        headers?: {
            [key: string]: any;
        };
    };

    constructor(session: Session, url?: string) {
        this.url = url ? url : (process.env.DRIVER_MS as string);
        this.options = {
            withCredentials: true,
            json: true,
            jar: rp.jar(),
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        };
    }

    /**
     * retrieveGeoCord
     */
    public async retrieveGeoCordinates({
        city,
        country,
        housenumber,
        street
    }: HereMaps.gcpa) {
        return rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                       {
                        generateCo_ordinates(partial_address: {country: "${country}", housenumber:"${housenumber}", city:"${city}", street: "${street}"}) {
                            __typename
                           ...on Error {
                            path
                            message
                          }
                          
                          ...on gco_response {
                            co_ordinates {
                              Latitude
                              Longitude
                            }
                            address {
                              Label
                              County
                              State
                              City
                              County
                              Street
                              AdditionalData{
                                key
                                value
                              }
                            }
                          }
                        }
                       }
                    `
            }
        });
    }

    private queryGen() {}
}