import { Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'
import { GetStaticProps } from 'next'

interface Data {}

export default function Index() {
  return (
    <>
      <Head />

      <main>Add Overview</main>
    </>
  )
}
