package com.pearson.chaski.ui.model.collections;

import java.util.Date;

/**
 * Object to represent an asset in the ui
 * @author Cdavidson
 *
 */
public class Asset {
	public String chaskiURI, objectId, title, mimetype, description;
	Date addedToCollection;
	public String getChaskiURI() {
		return chaskiURI;
	}
	public void setChaskiURI(String chaskiURI) {
		this.chaskiURI = chaskiURI;
	}
	public String getObjectId() {
		return objectId;
	}
	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getMimetype() {
		return mimetype;
	}
	public void setMimetype(String mimetype) {
		this.mimetype = mimetype;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Date getAddedToCollection() {
		return addedToCollection;
	}
	public void setAddedToCollection(Date addedToCollection) {
		this.addedToCollection = addedToCollection;
	}
}
