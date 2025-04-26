import React from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function UpdateForm({ project }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        progress_description: '',
        progress_percentage: project.progress_percentage || 0,
        milestones_completed: '',
        challenges_faced: '',
        resources_needed: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.updates.store', project.id), {
            onSuccess: () => {
                reset('progress_description', 'milestones_completed', 'challenges_faced', 'resources_needed');
            },
        });
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-2xl border border-rose-100 p-6 mt-6">
            <h3 className="text-lg font-bold text-rose-400 mb-4">Add Project Update</h3>
            
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="progress_percentage" value="Progress Percentage" className="text-rose-400" />
                    <div className="flex items-center mt-1 gap-4">
                        <input
                            type="range"
                            id="progress_percentage"
                            value={data.progress_percentage}
                            onChange={(e) => setData('progress_percentage', e.target.value)}
                            min="0"
                            max="100"
                            step="5"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm font-medium text-rose-700 w-12">
                            {data.progress_percentage}%
                        </span>
                    </div>
                    <InputError message={errors.progress_percentage} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="progress_description" value="Progress Description" className="text-rose-400" />
                    <textarea
                        id="progress_description"
                        value={data.progress_description}
                        onChange={(e) => setData('progress_description', e.target.value)}
                        rows="3"
                        className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                        placeholder="Describe what you've accomplished since the last update"
                        required
                    ></textarea>
                    <InputError message={errors.progress_description} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="milestones_completed" value="Milestones Completed (Optional)" className="text-rose-400" />
                    <textarea
                        id="milestones_completed"
                        value={data.milestones_completed}
                        onChange={(e) => setData('milestones_completed', e.target.value)}
                        rows="2"
                        className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                        placeholder="List any milestones you've completed"
                    ></textarea>
                    <InputError message={errors.milestones_completed} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="challenges_faced" value="Challenges Faced (Optional)" className="text-rose-400" />
                    <textarea
                        id="challenges_faced"
                        value={data.challenges_faced}
                        onChange={(e) => setData('challenges_faced', e.target.value)}
                        rows="2"
                        className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                        placeholder="Describe any challenges or blockers you're facing"
                    ></textarea>
                    <InputError message={errors.challenges_faced} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="resources_needed" value="Resources Needed (Optional)" className="text-rose-400" />
                    <textarea
                        id="resources_needed"
                        value={data.resources_needed}
                        onChange={(e) => setData('resources_needed', e.target.value)}
                        rows="2"
                        className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                        placeholder="List any resources you need to proceed"
                    ></textarea>
                    <InputError message={errors.resources_needed} className="mt-2" />
                </div>

                <div className="flex justify-end">
                    <PrimaryButton disabled={processing}>
                        Submit Update
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
} 