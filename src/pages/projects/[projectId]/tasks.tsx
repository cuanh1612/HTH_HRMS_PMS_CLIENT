import { GetStaticPaths, GetStaticProps } from 'next';
import * as React from 'react';
import { projectMutaionResponse } from 'type/mutationResponses';

export interface ITasksProps {
}

export default function Tasks (props: ITasksProps) {
  return (
    <div>
      
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: 10, // In seconds
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const res: projectMutaionResponse = await fetch('http://localhost:4000/api/projects').then(
		(result) => result.json()
	)
	const projects = res.projects

	if (!projects) {
		return { paths: [], fallback: false }
	}

	// Get the paths we want to pre-render based on leave
	const paths = projects.map((project: any) => ({
		params: { projectId: String(project.id) },
	}))

	// We'll pre-render only these paths at build time.
	// { fallback: blocking } will server-render pages
	// on-demand if the path doesn't exist.
	return { paths, fallback: false }
}
