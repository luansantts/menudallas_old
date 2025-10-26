import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { FiShare2 } from 'react-icons/fi'
import { MdOutlineWest } from 'react-icons/md'

function NavbarProduct({ productData }) {
    return (
        <Box position='fixed' top={0} left={0} w='100%' zIndex={999} pointerEvents='none'>
            <Flex justifyContent='space-between' alignItems='center' padding={['20px 18px', '24px 32px']}>
                <Link href='/lista' passHref legacyBehavior>
                    <Box
                        as='a'
                        pointerEvents='auto'
                        w={['44px', '52px']}
                        h={['44px', '52px']}
                        borderRadius='full'
                        bg='white'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        boxShadow='0px 10px 25px rgba(0, 0, 0, 0.08)'
                    >
                        <Icon fontSize='22px' as={MdOutlineWest} color='#0D0D0D' />
                    </Box>
                </Link>

                <Box
                    pointerEvents='auto'
                    w={['44px', '52px']}
                    h={['44px', '52px']}
                    borderRadius='full'
                    bg='white'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    boxShadow='0px 10px 25px rgba(0, 0, 0, 0.08)'
                >
                    <Icon fontSize='20px' as={FiShare2} color='#0D0D0D' />
                </Box>
            </Flex>

        </Box>
    )
}

export default NavbarProduct
