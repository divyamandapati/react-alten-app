import {
    connect,
    ConnectOptions,
    createLocalAudioTrack,
    createLocalVideoTrack,
    isSupported,
    LocalTrack,
    LocalVideoTrack,
    Participant,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
} from 'twilio-video';
import CommonService from './common-service';

let roomObj: Room;
let options: ConnectOptions = {};
// const subscribed_participants_map: { [userId: string]: RemoteParticipant } = {};

const mediaErrors = ['NotAllowedError', 'NotFoundError', 'NotReadableError', 'OverconstrainedError', 'TypeError'];

const toggleAudio = (isOn = false): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        if (isOn) {
            const audioTrack = await createLocalAudio(options.audio).catch(handleMediaError.bind(this, 'audio'));
            if (audioTrack) {
                await roomObj.localParticipant.publishTrack(audioTrack);
                resolve();
            } else {
                reject();
            }
        } else {
            turnOffAudio();
            resolve();
        }
    });
};

const listOfCameras = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const list: any[] = [];
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
            for (let device of devices) {
                if (device.kind === 'videoinput') {
                    list.push(device);
                }
            }
            resolve(list);
        }).catch(reject);
    })

}

const toggleVideo = (isOn = false) => {
    return new Promise(async (resolve, reject) => {
        if (isOn) {
            const videoTrack = await createLocalVideo(options.video).catch(handleMediaError.bind(this, 'video'));
            if (videoTrack) {
                await roomObj.localParticipant.publishTrack(videoTrack);
                renderLocalVideo([videoTrack]);
                resolve(null);
            } else {
                reject();
            }
        } else {
            turnOffVideo();
            resolve(null);
        }
    });
};

const handleMediaError = (mode: string, error: any) => {
    console.error('Failed to acquire media:', mode, error.name, error.message);
    CommonService._communications.mediaAvailabilitySubject.next({error: error, is_available: false, mode});
};
const createLocalTracks = async (options: any): Promise<any> => await createLocalTracks(options);

const createLocalVideo = async (options: any) => {
    return await createLocalVideoTrack(options);
};

const createLocalAudio = async (options: any) => {
    return await createLocalAudioTrack(options);
};

const renderLocalVideo = (localTracks: (LocalTrack | MediaStreamTrack)[]) => {
    if (roomObj.localParticipant) {
        if (localTracks && localTracks.length > 0) {
            const videoTrack = localTracks.find((value) => value.kind === 'video');
            if (videoTrack) {
                // const videoTrack = localVideos[0];
                const localVideoElem = document.getElementById('localVideo');
                if(localVideoElem) {
                    localVideoElem.innerHTML = '';
                }
                if (localVideoElem && videoTrack instanceof LocalVideoTrack) {
                    localVideoElem.appendChild(videoTrack.attach());
                }
            }
        }
    }
};

const turnOffAudio = () => {
    roomObj.localParticipant.audioTracks.forEach((publication) => {
        publication.unpublish();
        publication.track.stop();
    });
};
const flipCamera = () => {
    return new Promise((resolve, reject) => {
        toggleVideo(false).then(() => {
            options.video = {facingMode: typeof options.video !== "boolean" && options.video?.facingMode === 'user' ? 'environment' : 'user'}
            toggleVideo(true).then(() => {
                resolve(true);
            }).catch(reject);
        }).catch(reject);
    })
}
const turnOffVideo = () => {
    roomObj.localParticipant.videoTracks.forEach((publication) => {
        publication.track.detach().forEach((element) => {
            element.remove();
        });
        publication.unpublish();
        publication.track.stop();
    });
};

const disconnectFromRoom = () => {
    return new Promise((resolve, reject) => {
        if (roomObj) {
            turnOffAudio();
            turnOffVideo();
            roomObj.disconnect();
        }

        // roomObj.
        resolve(null);
    });
};

const connectToRoom = async (accessToken: string, options: ConnectOptions) => {
    if (!isSupported) {
        console.error('This browser is not supported by webRTC');
        return;
    }
    const connectOptions = {...options};
    const tracks: LocalTrack[] = [];
    if (options.audio) {
        const audioTrack = await createLocalAudio(options.audio).catch(handleMediaError.bind(this, 'audio'));
        if (audioTrack) {
            tracks.push(audioTrack);
            CommonService._communications.mediaAvailabilitySubject.next({is_available: true, mode: 'audio'});
        } else {
            connectOptions.audio = false;
        }
    }
    if (options.video) {
        const videoTrack = await createLocalVideo(options.video).catch(handleMediaError.bind(this, 'video'));
        if (videoTrack) {
            tracks.push(videoTrack);
            CommonService._communications.mediaAvailabilitySubject.next({is_available: true, mode: 'video'});
        } else {
            connectOptions.video = false;
        }
    }
    if (tracks && tracks.length > 0) {
        connectOptions.tracks = tracks;
    }
    connect(accessToken, connectOptions)
        .then((room) => {
            CommonService._communications.webRtcConnectedSubject.next(true);
            roomObj = room;
            if (connectOptions.tracks && connectOptions.tracks.length > 0) {
                renderLocalVideo(connectOptions.tracks);
            }
            // Set up remote video notifications for the VideoTracks of RemoteParticipants
            // already in the Room.
            roomObj.participants.forEach(participantConnected.bind(this));

            // Set up remote video notifications for the VideoTracks of RemoteParticipants
            // that will join the Room later.
            // @ts-ignore
            roomObj.on('participantConnected', participantConnected.bind(this));

            // @ts-ignore
            roomObj.on('participantDisconnected', participantDisconnected.bind(this));

            // @ts-ignore
            roomObj.once('disconnected', (room, error) => {
                if (error) {
                    CommonService._communications.webRtcConnectedSubject.next(false);
                    if (error.code === 53205) {
                        // user logged on from another device
                        CommonService.showToast(error.message, 'error');
                    } else {
                        connectToRoom(accessToken, options);
                    }
                }
            });
        })
        .catch((error) => {
            CommonService._communications.webRtcConnectedSubject.next(false);
            console.error('Twilio error :', error.message);
            if (mediaErrors.includes(error.name)) {
                // Handle media error here.
                // handleMediaError('room', error);
            }
            if (connectOptions.tracks) {
                connectOptions.tracks.forEach((track) => {
                    if (track.kind === 'video' || track.kind === 'audio') {
                        track.stop();
                    }
                });
            }
            CommonService._communications.mediaAvailabilitySubject.next({
                error: 'Room Connection Failed',
                is_available: false,
                mode: 'audio'
            });
            CommonService._communications.mediaAvailabilitySubject.next({
                error: 'Room Connection Failed',
                is_available: false,
                mode: 'video'
            });
        });
};

const setupSubscriptionListeners = (participant: RemoteParticipant, publication: RemoteTrackPublication) => {
    if (publication.isSubscribed) {
        // Indicate to the user that the mobile user has added video.
    }

    // @ts-ignore
    publication.on('subscribed', (track: RemoteTrack) => {
        // console.log('subscribed', track);
        // Indicate to the user that the mobile user has added video.
        renderParticipantTrack(participant, track);
    });

    // @ts-ignore
    publication.on('unsubscribed', (track: RemoteTrack) => {
        // console.log('unsubscribed', track);
        removeParticipantTrack(participant, track);
        // Indicate to the user that the mobile user has removed video.
    });
};

const participantConnected = (participant: RemoteParticipant) => {
    // Set up remote video notifications for the VideoTracks that are
    // already published.

    participant.tracks.forEach(setupSubscriptionListeners.bind(this, participant));

    // Set up remote video notifications for the VideoTracks that will be
    // published later.
    // @ts-ignore
    participant.on('trackPublished', setupSubscriptionListeners.bind(this, participant));
    CommonService._communications.participantDisconnected.next(false);
};

const participantDisconnected = (participant: RemoteParticipant) => {
    removeParticipantTracks(participant);
    CommonService._communications.participantDisconnected.next(true);
};

// unsubscribeParticipants(retainer_ids: string[]) {
//   for (const attendeeId in subscribed_participants_map) {
//     if(subscribed_participants_map.hasOwnProperty(attendeeId)) {
//       const participant = subscribed_participants_map[attendeeId];
//       // console.log('participant ...', retainer_ids, participant.identity, retainer_ids.indexOf(participant.identity) === -1);
//       if (retainer_ids.indexOf(participant.identity) === -1) {
//         removeParticipantTracks(participant);
//         delete subscribed_participants_map[attendeeId];
//       }
//     }
//   }
//   // subscribed_participants.forEach((participant, i) =>{
//   //   console.log('participant ...', retainer_ids, participant.identity, retainer_ids.indexOf(participant.identity) === -1);
//   //   if (retainer_ids.indexOf(participant.identity) === -1) {
//   //     removeParticipantTracks(participant);
//   //     subscribed_participants.splice(i, 1);
//   //   }
//   // });
// }

// connectToUsers(participant_ids: string[]) {
//   unsubscribeParticipants(participant_ids);
//   if (roomObj && roomObj.participants) {
//     roomObj.participants.forEach((participant) => {
//       if (participant_ids.indexOf(participant.identity) > -1) {
//         // const found = subscribed_participants.find((p) => p.identity === participant.identity);
//         if (!subscribed_participants_map.hasOwnProperty(participant.identity)) {
//           // subscribed_participants.push(participant);
//           subscribed_participants_map[participant.identity] = participant;
//           renderParticipantTracks(participant);
//         } else {
//           // console.log('already video found');
//         }
//       }
//     });
//   }
// }

const renderParticipantTracks = (participant: RemoteParticipant) => {
    participant.videoTracks.forEach((publication) => {
        renderParticipantTrack(participant, publication.track);
    });
    participant.audioTracks.forEach((publication) => {
        renderParticipantTrack(participant, publication.track);
    });
    participant.dataTracks.forEach((publication) => {
        renderParticipantTrack(participant, publication.track);
    });
};

const removeParticipantTracks = (participant: RemoteParticipant) => {
    participant.videoTracks.forEach((publication) => {
        removeParticipantTrack(participant, publication.track);
    });
    participant.audioTracks.forEach((publication) => {
        removeParticipantTrack(participant, publication.track);
    });
    participant.dataTracks.forEach((publication) => {
        removeParticipantTrack(participant, publication.track);
    });
};

const renderParticipantTrack = (participant: Participant, track: RemoteTrack | null) => {
    const userId = participant.identity;
    // console.log('render track', attendee_id, track);
    CommonService._communications.streamSubscribedSubject.next({track, userId});
    // if (subscribed_participants.indexOf(attendee_id) > -1) {
    // }
};

const removeParticipantTrack = (participant: Participant, track: RemoteTrack | null) => {
    const userId = participant.identity;
    CommonService._communications.streamUnsubscribedSubject.next({track, userId});
    // console.log('remove track', attendee_id, track);
    // if (subscribed_participants.indexOf(attendee_id) > -1) {
    // }
};

const TwilioService = {
    connectToRoom,
    flipCamera,
    toggleAudio,
    toggleVideo,
    disconnectFromRoom,
    renderParticipantTracks,
    createLocalTracks,
    listOfCameras,
};

export default TwilioService;
