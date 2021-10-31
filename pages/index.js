import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';

// ? import di nextjs bisa langsung dicampur server side dan client side
// ? karen nextjs sudah otomatis cek tergantung kita pakainya dimana
// ? misal MongoClientdipakai di staticprops(server import) tidak akan dikirim ke client file jsnya

const HomePage = (props) => {
  // ? karena useState dan useEffect page ini jadi jalan render 2x
  // ? jadi di pre-render oleh nextjs hanya Layoutnya ajh di _app.js
  // ! pre-render di nextjs hanya untuk load pertama kali
  // ! proses dynamic setelah itu tidak di pre-render
  // ? jadinya konten meetupnya tidak ada di source HTMLnya

  //   const [meetups, setMeetups] = useState([]);

  //   useEffect(() => {
  //     setMeetups(DUMMY_MEETUPS);
  //   }, []);
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse list of highly active react meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

// ? hanya untuk file di dalam pages folder
// ? untuk prepare props di page ini
// ? akan dirun saat proses pre-render, jadi tidak akan dijalankan di client
// ? getStaticProps jalan dulu baru comp func di atas

// ! generate static HTML file saat build time(npm run build)
// ! khusus saat di dev mode tetap akan di pre-render setiap request
// ! SSR vs SSG
// ! on each request vs only one time(build time)

export async function getStaticProps() {
  // fetch data here will run on build time initially
  // ? data yang difetch disini sekali di build akan selalu sama, jadi hanya untuk initial render
  // ? kecuali ada script yang ubah HTMLnya di client side rendering
  // ? solusi lain pke revalidate -> untuk auto refresh buildnya di server
  // ? jadi seolah2 jalanin npm run build lagi untuk update data dalam interval waktu tertentu
  // ? revalidate: [seconds]

  const client = await MongoClient.connect(
    'mongodb+srv://admin:GOnPQ9quJAJMd4zV@cluster0.lug7u.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetupCollection = db.collection('meetups');
  const meetups = await meetupCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
      revalidate: 1,
    },
  };
}

// export async function getServerSideProps(context) {
//   // fetch data here will run on server on each request
//   // ? tidak akan jalan di build tim, tapi setiap request ke page ini saat di deploy

//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export default HomePage;
