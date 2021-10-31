import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetails from '../../components/meetups/MeetupDetails';

const MeetUpDetailsPage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetails
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

export async function getStaticPaths() {
  // ? untuk define path apa ajh yg perlu digenerate static props
  // ? fallback false -> kalau id yg diakses tidak dilist akan 404
  // ? fallback true -> kalau id yg diakses tidak dilist akan generate dynamic ga static

  const client = await MongoClient.connect(
    'mongodb+srv://admin:GOnPQ9quJAJMd4zV@cluster0.lug7u.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetupCollection = db.collection('meetups');
  const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  // ? karena ini dynamic page, dan pakai getstaticprops
  // ? artinya nextjs harus generate semua html untuk setiap id
  // ? cara cek jalan di server atau ga liat lognya kalau muncul di terminal di server
  // ? kalau di browser artinya jaaln di client side
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    'mongodb+srv://admin:GOnPQ9quJAJMd4zV@cluster0.lug7u.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetupCollection = db.collection('meetups');
  const selectedMeetup = await meetupCollection.findOne({
    _id: ObjectId(meetupId),
  });

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetUpDetailsPage;
