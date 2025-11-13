import { Box, Button, Flex, Icon } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { MdOutlineArrowBack, MdOutlineWest } from 'react-icons/md'

function NavbarOrder({ data, text = '', linkBack = '/lista', handleOrder }) {
    return (
        <Box
            position='fixed'
            zIndex={50}
            justifyContent='space-between'
            top={0}
            left={0}
            right={0}
            padding={['20px 18px', '20px 18px']}
            w='100%'
            h='68px'
            display='flex'
            alignItems='center'
            bg='#ffffff'
            borderBottom='1px solid #ededed'
        >
            <Flex alignItems='center'>
                <Link href={linkBack} passHref legacyBehavior>
                    <Box
                        as='a'
                        w='40px'
                        h='40px'
                        p='10px'
                        borderRadius='100px'
                        bg='white'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        boxShadow='0px 10px 25px rgba(0, 0, 0, 0.15)'
                        _hover={{ transform: 'scale(1.05)' }}
                        transition='transform 0.2s ease'
                    >
                        <img
                            src="/icons/chevron-left.svg"
                            alt="Voltar"
                            width={20}
                            height={20}
                            style={{ width: 20, height: 20, minWidth: 20, minHeight: 20 }}
                        />
                    </Box>
                </Link>
            </Flex>

            <Button
                variant='transparent'
                bg={data?.primary_color}
                borderRadius='36px'
                fontSize={['13px', '20px']}
                color='white'
                p={['12px 16px', '25px 30px']}
                onClick={handleOrder}
                boxShadow='0 10px 25px rgba(0,0,0,.15)'
            >
                FINALIZAR PEDIDO
            </Button>
        </Box>
    )
}

export default NavbarOrder
