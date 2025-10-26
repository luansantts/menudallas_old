import { Box } from '@chakra-ui/react';
import React from 'react';
import Navbar from '../Navbar/Navbar';
import HeaderHomeStore from '../HeaderHomeStore/HeaderHomeStore';
import InfoStoreHome from '../InfoStoreHome/InfoStoreHome';
import Head from 'next/head';

function HomeStore({ data, subdomain }) {

    return (
        <>
            <Head>
                <style>
                    {`
                        body {
                            background: white !important;
                        }
                    `}
                </style>
            </Head>

            <Box pt={["68px", "88px"]}>
                <Navbar isHome={false} data={data} subdomain={subdomain} />
                <HeaderHomeStore data={data} />
                <InfoStoreHome data={data} subdomain={subdomain} />
            </Box>
        </>
    )
}

export default HomeStore;
