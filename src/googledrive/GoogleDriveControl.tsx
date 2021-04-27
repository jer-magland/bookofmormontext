import { Button } from "@material-ui/core";
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { CustomPunctuatedChapters } from "../common/hooks";

type Props = {
    punctuation: CustomPunctuatedChapters
    onLoadPunctuation: (x: CustomPunctuatedChapters) => void
}

const GoogleDriveControl: FunctionComponent<Props> = ({punctuation, onLoadPunctuation}) => {
    const [gapi, setGapi] = useState<any>(null)
    const [signedIn, setSignedIn] = useState<boolean>(false)
    const [lastSavedPunctuation, setLastSavedPunctuation] = useState<CustomPunctuatedChapters | null | undefined>(undefined)
    useEffect(() => {
        const g = (window as any).gapi
        g.load('client:auth2', () => {
            /**
             *  Initializes the API client library
             */

            // Client ID and API key from the Developer Console
            var CLIENT_ID = '894606936958-55h8b89698tbkd4hvrqltq2rhon5h54n.apps.googleusercontent.com';
            var API_KEY = 'AIzaSyApyNc0dA-8GypLwx4mp1gPHkJ_eT7sWeQ';

            // Array of API discovery doc URLs for APIs used by the quickstart
            var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

            // Authorization scopes required by the API; multiple scopes can be
            // included, separated by spaces.
            var SCOPES = 'https://www.googleapis.com/auth/drive.file';

             g.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(function () {
                // Listen for sign-in state changes.
                g.auth2.getAuthInstance().isSignedIn.listen(() => {
                    setSignedIn(g.auth2.getAuthInstance().isSignedIn.get());
                });
                setSignedIn(g.auth2.getAuthInstance().isSignedIn.get());
                setGapi(g)
            }).catch((error: Error) => {
                console.warn(error)
            });
        });
    }, [])

    const handleSignIn = useCallback(() => {
        // Sign in the user upon button click.
        gapi.auth2.getAuthInstance().signIn();
    }, [gapi])
    const handleSignOut = useCallback(() => {
        gapi.auth2.getAuthInstance().signOut()
    }, [gapi])

    const handleSaveWork = useCallback(async () => {
        const folderId = await getFolderId(gapi, 'bookofmormontext')
        var fileContent = JSON.stringify(punctuation)
        var file = new Blob([fileContent], {type: 'application/json'});
        const timestamp = Date.now()
        var metadata = {
            'name': `punctuation-${timestamp}.json`, // Filename at Google Drive
            'mimeType': 'application/json', // mimeType at Google Drive
            'parents': [folderId] // Folder ID at Google Drive
        };
        var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        const result = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
            body: form,
        })
        if (result.ok) {
            setLastSavedPunctuation(punctuation)
        }
    }, [gapi, punctuation])

    const handleLoadWork = useCallback(() => {
        if (lastSavedPunctuation) {
            onLoadPunctuation(lastSavedPunctuation)
        }
    }, [onLoadPunctuation, lastSavedPunctuation])

    const punctuationSaved = useMemo(() => {
        return JSON.stringify(lastSavedPunctuation) === JSON.stringify(punctuation)
    }, [punctuation, lastSavedPunctuation])

    useEffect(() => {
        if ((lastSavedPunctuation === undefined) && (gapi)) {
            findLatestPunctuationFileId(gapi).then((fileId) => {
                if (!fileId) {
                    setLastSavedPunctuation(null)
                }
                else {
                    gapi.client.drive.files.get({fileId, alt: 'media'}).then((resp: any) => {
                        if (resp.result) {
                            setLastSavedPunctuation(resp.result)
                        }
                        else {
                            setLastSavedPunctuation(null)
                        }
                    })
                }
            })
        }
    }, [gapi, lastSavedPunctuation])

    return <div>
        {
            <span>
                <h3>Google drive</h3>
                {
                    signedIn ? (
                        <span>
                            <Button onClick={handleSaveWork} disabled={(punctuationSaved) || (lastSavedPunctuation === undefined)}>Save work to drive</Button>
                            <Button onClick={handleLoadWork} disabled={(punctuationSaved) || (lastSavedPunctuation === undefined)}>Load work from drive</Button>
                            <Button onClick={handleSignOut}>Sign out</Button>
                        </span>
                    ) : (
                        <Button onClick={handleSignIn} disabled={!gapi}>Sign in</Button>
                    )
                }
            </span>
        }
        
        {/* <button onClick={handleListFiles} disabled={!signedIn}>List files</button>
        <button onClick={handleUploadTest} disabled={!signedIn}>Upload test</button> */}
    </div>
}

const findLatestPunctuationFileId = async(gapi: any) => {
    const folderId = await getFolderId(gapi, 'bookofmormontext')
    const response = await gapi.client.drive.files.list({
        "q": `mimeType='application/json' and name contains 'punctuation' and trashed = false and '${folderId}' in parents`,
        "orderBy": "name desc"
    })
    var files = response.result.files;
    if (files && files.length > 0) {
        return files[0].id
    } else {
        return undefined
    }
}

const getFolderId = async (gapi: any, folderName: string) => {
    const response = await gapi.client.drive.files.list({
        "q": `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed = false`
    })
    const files = response.result.files;
    if (files) {
        for (let f of files) {
            if (f.mimeType === 'application/vnd.google-apps.folder') {
                return f.id
            }
        }
    }
    var folderMetadata = {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder'
    };
    const resp2 = await gapi.client.drive.files.create({
        resource: folderMetadata,
        fields: 'id'
    })
    return resp2.result.id
}

export default GoogleDriveControl