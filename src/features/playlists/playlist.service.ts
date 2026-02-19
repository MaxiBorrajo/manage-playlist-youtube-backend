import { Injectable } from "@nestjs/common";

@Injectable()
export class PlaylistsService {
    private playlists = [
        {
            id: 1,
            name: 'Playlist 1',
            description: 'Description of Playlist 1',
            videos: [
                {
                    id: 1,
                    name: 'Video 1',
                    description: 'Description of Video 1',
                    url: 'https://www.youtube.com/watch?v=video1'
                },  
                {
                    id: 2,
                    name: 'Video 2',
                    description: 'Description of Video 2',
                    url: 'https://www.youtube.com/watch?v=video2'
                }
            ]
        },
        {
            id: 2,
            name: 'Playlist 2',
            description: 'Description of Playlist 2',
            videos: [
                {
                    id: 3,
                    name: 'Video 3',
                    description: 'Description of Video 3',
                    url: 'https://www.youtube.com/watch?v=video3'
                },
                {
                    id: 4,
                    name: 'Video 4',
                    description: 'Description of Video 4',
                    url: 'https://www.youtube.com/watch?v=video4'
                }
            ]
        }
    ];

    findAll({ userId }: { userId: number }) {
        return this.playlists;
    }

    findOneById(id: number) {
        return this.playlists.find((playlist) => playlist.id === id);
    }
}