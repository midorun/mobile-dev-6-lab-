import { NoteParams, TagParams } from 'api/types';

const IP = {
  pc: '192.168.1.36',
  phone: '172.20.10.3',
  mac: '192.168.1.45'
}

const _rootUrl = `http://${IP.mac}:3000/api`;
const _tagsUrl = '/tags';
const _notesUrl = '/notes';

console.log(_rootUrl)

export const useApi = () => {
  const getData = async (url: string) => {
    const response = await fetch(`${_rootUrl}${url}`);

    if (!response.ok) {
      throw new Error(
        `Couldn't fetch data from ${url}, status ${response.status}`
      );
    }

    return await response.json();
  };

  const postData = async (url: string, data: unknown) => {
    const response = await fetch(`${_rootUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Couldn't post data to ${url}, status ${response.status}`
      );
    }
    return await response.json();
  };

  const deleteData = async (url: string, id: number) => {
    const response = await fetch(`${_rootUrl}${url}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(
        `Couldn't post data to ${url}, status ${response.status}`
      );
    }
    return await response.json();
  };

  const updateData = async (url: string, id: number, data: unknown) => {
    const response = await fetch(`${_rootUrl}${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Couldn't put data to ${url}, status ${response.status}`);
    }
    return await response.json();
  };

  const getAllTags = async () => {
    return await getData(`${_tagsUrl}`);
  };

  const getTag = async (id: number) => {
    return await getData(`${_tagsUrl}/${id}`);
  };

  const postTag = async (data: TagParams) => {
    return await postData(`${_tagsUrl}`, data);
  };

  const deleteTag = async (id: number) => {
    return await deleteData(`${_tagsUrl}`, id);
  };

  const updateTag = async (id: number, data: TagParams) => {
    return await updateData(`${_tagsUrl}`, id, data);
  };

  const getAllNotes = async () => {
    return await getData(`${_notesUrl}`);
  };

  const getNote = async (id: number) => {
    return await getData(`${_notesUrl}/${id}`);
  };

  const postNote = async (data: NoteParams) => {
    return await postData(`${_notesUrl}`, data);
  };

  const deleteNote = async (id: number) => {
    return await deleteData(`${_notesUrl}`, id);
  };

  const updateNote = async (id: number, data: NoteParams) => {
    return await updateData(`${_notesUrl}`, id, data);
  };

  const checkAuth = async (): Promise<unknown> => {
    return await getData('/fsdfsdf')
  }

  return {
    getAllTags,
    getTag,
    postTag,
    deleteTag,
    updateTag,
    getAllNotes,
    getNote,
    postNote,
    deleteNote,
    updateNote,
    checkAuth,
  };
};
